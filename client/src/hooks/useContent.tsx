import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase"; 
import { Session } from "@supabase/supabase-js"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Content = {
    id: string,
    share: boolean,
    isSharedPage: boolean,
    title: string,
    link: string,
    type: "youtube" | "twitter" | "reddit" | "others",
    created_at: Date
}

type ResponseData = {
    content: Content[]
}

export const useContent = () => {
    const [content, setContent] = useState<Content[]>([]);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session);
        });
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
    
        return () => subscription.unsubscribe();
      }, []);
      
    async function refresh() {
        if(!session?.access_token) return console.log("no access token");

        try {
            const response = await axios.get<ResponseData>(`${BACKEND_URL}/api/second-brain/content`, {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })
            setContent(response.data?.content)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if(!session) return;

        refresh()
        const interval = setInterval(refresh, 10*1000)

        return () => clearInterval(interval)
    }, [])

    return {content, refresh}
}