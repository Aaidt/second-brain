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

   // useEffect(() => {
   //     supabase.auth.getSession().then(({ data }) => {
   //       setSession(data.session);
   //     });

   //     const {
   //       data: { subscription },
   //     } = supabase.auth.onAuthStateChange((_event, session) => {
   //       setSession(session);
   //     });

   //     return () => subscription.unsubscribe();
   //   }, []);

   async function refresh() {
      // Get the latest session to ensure we have the token
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session?.access_token) {
         console.log("no access token");
         return;
      }

      try {
         const response = await axios.get<ResponseData>(`${BACKEND_URL}/api/second-brain/content`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
         })
         setContent(response.data?.content)
      } catch (err) {
         console.error(err)
      }
   }

   useEffect(() => {
      // Only start refreshing when we have a session
      if (!session?.access_token) return;

      refresh()
      const interval = setInterval(refresh, 10 * 1000)

      return () => clearInterval(interval)
   }, [session])

   return { content, refresh }
}
