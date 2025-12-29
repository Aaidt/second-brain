import { Sidebar } from "../components/ui/Sidebar"
import { CardComponent } from "../components/ui/CardComponent"
import { useState, useEffect } from "react";
import { SearchBar } from "../components/ui/SearchBar"
import { useSideBar } from "../hooks/sidebarContext";
import Masonry from "react-masonry-css"
import { motion } from 'framer-motion'
import { ThoughtCards } from "../components/ui/ThoughtCards"
import axios from "axios";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

type Content = {
    id: string,
    share: boolean,
    isSharedPage: boolean,
    title: string,
    link: string,
    type: "youtube" | "twitter" | "reddit" | "others",
    created_at: Date
}

type thoughts = {
    title: string,
    body: string,
    id: string,
    created_at: Date
}

interface axiosResponse {
    message: string,
    content: Content[],
    thought: thoughts[]
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function SharedBrainPage() {
    const { shareLink } = useParams(); 

    const [type, setType] = useState<string | undefined>();
    const [content, setContent] = useState<Content[]>([]); 
    const [thoughts, setThoughts] = useState<thoughts[]>([]);
    const [session, setSession] = useState<Session | null>(null)

    supabase.auth.getSession().then(({data: {session}}) => {
        setSession(session);
    });
    const token = session?.access_token;

    useEffect(() => {
        async function fetch() {
            try {
                const res = await axios.post<axiosResponse>(
                    `${BACKEND_URL}/api/second-brain/link/share/${shareLink}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                );
                if (res.data) {
                    setContent(res.data.content || []);
                    setThoughts(res.data.thought || []);
                }
            } catch (err) {
                console.error(err);
            }
        }
        if (shareLink && token) fetch();
    }, [shareLink, token]);

    const { sidebarClose } = useSideBar();

    const breakpointColumnsObjClosed: { [key: number]: number; default: number } = {
        default: 4,
        768: 3,
        640: 2,
        500: 1
    };

    const breakpointColumnsObjOpen: { [key: number]: number; default: number } = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    const breakpointColumnsObj = sidebarClose ? breakpointColumnsObjClosed : breakpointColumnsObjOpen;


    return (
        <div className="min-h-screen h-full w-full min-h-full bg-white font-serif text-black">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-0 left-0 mr-5">
                <Sidebar type={type} setType={setType} />
            </motion.div>
            <div className={`flex ${sidebarClose ? 'pl-20' : 'pl-75'} duration-200 text-md pt-5 p-1`}>
                <SearchBar />
            </div>

            <div className={`${`${sidebarClose ? 'pl-20' : 'pl-75'} p-4 pt-10 duration-200 gap-4`}`}>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto"
                    columnClassName="pl- bg-clip-padding"
                >
                    {content.filter((content) => !type || content.type?.trim() === type.trim())
                        .map(({ title, link, type, id, created_at }) =>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: Number(id) * 2 }} key={id} className="mb-4">
                                <CardComponent title={title} type={type} link={link} id={id} isSharedPage={true} created_at={created_at} />
                            </motion.div>
                        )}

                    {thoughts?.filter(() => {
                        return !type || type?.trim() === "thoughts"
                    })
                        .map(({ title, body, id, created_at }) =>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: Number(id) * 2 }} key={id} className="mb-4">
                                <ThoughtCards title={title} body={body} id={id} isSharedPage={true} created_at={created_at} />
                            </motion.div>
                        )
                    }
                </Masonry>
            </div>
        </div>
    )
}
