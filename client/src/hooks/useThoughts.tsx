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

    async function reFetch() {
        try{
            const response = await axios.get<ResponseData>(`${BACKEND_URL}/api/v1/second-brain/thoughts`, {
                headers: {
                    "Authorization": localStorage.getItem("authorization")
                }
            })
            setThoughts(response.data?.thoughts)
        }catch(err){
            console.log(err);
        }
    }

    console.log("Thoughts data:", thoughts);
    useEffect(() => {
        reFetch();
        const interval = setInterval(reFetch, 10000);

        return () => clearInterval(interval);
    })

    return {thoughts, reFetch}
}