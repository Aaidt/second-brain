import { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken, refreshAccessToken } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Content = {
    title: string,
    link: string,
    type: "youtube" | "twitter" | "reddit" | "others",
    _id: string
}

type ResponseData = {
    content: Content[]
}

export const useContent = () => {
    const [contents, setContents] = useState<Content[]>([]);

    function refresh() {
        try {
            let token = getAccessToken();
            if (!token) {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                refreshAccessToken(BACKEND_URL).then(newToken => {
                    token = newToken;
                });
            }
            axios.get<ResponseData>(`${BACKEND_URL}/second-brain/api/content`, {
                headers: {
                    "Authorization": token
                }
            })
                .then((response) => {
                    setContents(response.data?.content)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        refresh()
        const interval = setInterval(refresh, 10*1000)

        return () => clearInterval(interval)
    }, [])

    return {contents, refresh}
}