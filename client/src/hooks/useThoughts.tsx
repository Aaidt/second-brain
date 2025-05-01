import { useEffect, useState } from "react";
import axios from "axios"

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

    function reFetch() {
        try {
            axios.get<ResponseData>(`${BACKEND_URL}/api/v1/second-brain/thoughts`, {
                headers: {
                    "Authorization": localStorage.getItem("authorization")
                }
            })
                .then((response) => {
                    setThoughts(response.data?.thoughts)
                })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        reFetch();
        const interval = setInterval(reFetch, 10 * 1000);

        return () => clearInterval(interval);
    }, [])
    console.log("Thoughts data:", thoughts);

    return { thoughts, reFetch }
}