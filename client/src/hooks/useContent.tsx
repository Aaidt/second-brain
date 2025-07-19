import { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken, refreshAccessToken } from "../auth";

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

    async function refresh() {
        try {
            let token = getAccessToken();
            if (!token) {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                token = await refreshAccessToken(BACKEND_URL)
            }
            const response = await axios.get<ResponseData>(`${BACKEND_URL}/second-brain/api/content`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setContent(response.data?.content)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        refresh()
        
        const interval = setInterval(refresh, 10*1000)

        return () => clearInterval(interval)
    }, [])

    return {content, refresh}
}