import { useState, useEffect } from "react";
import axios from "axios";

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
            axios.get<ResponseData>(`${BACKEND_URL}/api/v1/second-brain/content`, {
                headers: {
                    "Authorization": localStorage.getItem("authorization")
                }
            })
                .then((response) => {
                    setContents(response.data?.content)
                    console.log(response.data?.content)
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