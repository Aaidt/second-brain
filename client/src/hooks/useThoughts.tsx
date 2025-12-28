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

    supabase.auth.getSession().then(({data: {session}}) => {
        setSession(session);
    })
    const token = session?.access_token;

    async function reFetch() {
        try {
            const response = await axios.get<ResponseData>(`${BACKEND_URL}/second-brain/api/thought`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setThoughts(response.data?.thoughts);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        reFetch();
        const interval = setInterval(reFetch, 10 * 1000);

        return () => clearInterval(interval);
    }, [])

    return { thoughts, reFetch }
}