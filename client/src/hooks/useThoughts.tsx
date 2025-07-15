import { useEffect, useState } from "react";
import axios from "axios"
import { getAccessToken, refreshAccessToken } from "../auth";

export const useThoughts = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    type thoughts = {
        title: string,
        thoughts: string,
        _id: string
    }

    interface ResponseData {
        thoughts: thoughts[]
    }

    const [thoughts, setThoughts] = useState<thoughts[]>([])

    async function reFetch() {
        try {
            let token = getAccessToken();
            if (!token) {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                token = await refreshAccessToken(BACKEND_URL)
            }
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