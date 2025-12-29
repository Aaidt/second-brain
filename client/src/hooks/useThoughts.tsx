import { useEffect, useState } from "react";
import axios from "axios"
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export const useThoughts = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    type thoughts = {
        title: string,
        body: string,
        id: string,
        created_at: Date
    }

    interface ResponseData {
        thoughts: thoughts[]
    }

    const [thoughts, setThoughts] = useState<thoughts[]>([])
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

    async function reFetch() {
        if(!session?.access_token) return console.log("no access token: ", session?.access_token);
        try {
            const response = await axios.get<ResponseData>(`${BACKEND_URL}/api/second-brain/thought`, {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })

            setThoughts(response.data?.thoughts);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(!session) return;
        reFetch();
        const interval = setInterval(reFetch, 10 * 1000);

        return () => clearInterval(interval);
    }, [])

    return { thoughts, reFetch }
}