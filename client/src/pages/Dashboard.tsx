import { Button } from "../components/ui/NativeButton"
import { Sidebar } from "../components/ui/Sidebar"
import { CardComponent } from '../components/ui/CardComponent';
import { CreateContentModal } from "../components/ui/createContentModal"
import { useState, useEffect, useRef } from "react";
import { useContent } from "../hooks/useContent"
import axios from "axios";
import { SearchBar } from "../components/ui/SearchBar"
import { useSideBar } from "../hooks/sidebarContext";
import Masonry from "react-masonry-css"
import { CreateThoughtModal } from "../components/ui/createThoughtModal"
import { useThoughts } from "../hooks/useThoughts"
import { ThoughtCards } from '../components/ui/ThoughtCards';
import { motion } from 'framer-motion'
import { toast } from "react-toastify"
import { getAccessToken, refreshAccessToken } from "@/auth"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Plus, Share, BookOpen } from "lucide-react"

export function Dashboard() {
    let token;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

    const [type, setType] = useState<string | undefined>()

    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [thoughtModalOpen, setThoughtModalOpen] = useState(false);
    const [share, setShare] = useState(true)

    const { content, refresh } = useContent()
    const { thoughts, reFetch } = useThoughts()

    useEffect(() => {
        reFetch()
        refresh()
    }, [])

    const pageContent = [
        ...content.map(items => ({...items, category: "content"}) as ContentType),
        ...thoughts.map(items => ({ ...items, category: "thoughts"}) as ThoughtType)
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    type ContentType = {
        category: "content",
        title: string,
        link: string,
        id: string,
        share: boolean,
        isSharedPage: boolean,
        type: 'youtube' | 'twitter' | 'reddit' | 'others',
        created_at: Date
    }

    type ThoughtType = {
        category: "thoughts",
        title: string,
        body: string,
        id: string,
        created_at: Date
    }

    interface ResponseData {
        link: string
    }

    function alertUser(share: boolean, responseData: ResponseData) {
        if (share) {
            toast.success("Share this link to give access to others:⚡" + `${CLIENT_URL}${'/share/'}${responseData?.link}`)
        } else {
            toast.error("You have tuned OFF sharing now. Click the button again to turn it ON")
        }
    }


    async function handleShare() {
        setShare(!share)
        try {
            token = getAccessToken()
            if(!token){
                token = await refreshAccessToken(BACKEND_URL)
            }
            const response = await axios.post<ResponseData>(`${BACKEND_URL}/second-brain/api/link/share`, { share },
                { headers: { Authorization: `Bearer ${token}` } });

            if (!response) {
                toast.error('Issue with the Backend response')
            }

            alertUser(share, response.data)
        }
        catch (err) {
            toast.error('err:' + err);
        }
    }

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

    const searchRef = useRef<HTMLInputElement>(null)

    return (
        <div className="min-h-screen min-h-full w-full bg-background font-serif text-foreground/95">
            <CreateContentModal open={contentModalOpen} setOpen={setContentModalOpen} />
            <CreateThoughtModal open={thoughtModalOpen} setOpen={setThoughtModalOpen} />


            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-0 left-0 mr-5">
                <Sidebar type={type} setType={setType} />
            </motion.div>
            <div className={`flex ${sidebarClose ? 'pl-20' : 'pl-75'} duration-200 text-md pt-5 p-1`}>
                <SearchBar ref={searchRef} />
            </div>

            <div className={`${sidebarClose ? 'pl-20' : 'pl-75'} p-4 pt-10 duration-200 gap-4`}>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto"
                    columnClassName="bg-clip-padding"
                >

                        {pageContent.filter((content) => {
                            const searchVal = searchRef.current?.value.toLowerCase() || ""
                            return !searchVal || content.title.toLowerCase().includes(searchVal)
                        })
                            .filter((content) => {
                                const selectedType = type?.trim() || ''
                                if (!selectedType) return true ;

                                if(['twitter', 'youtube', 'reddit', 'others'].includes(selectedType)){
                                    return content.category === "content" && content.type?.trim() === selectedType
                                }

                                if(selectedType === "thoughts"){
                                    return content.category === "thoughts"
                                }

                                return true

                            }).map(item => {
                                if(item.category === "content"){
                                    return <CardComponent
                                        title={item.title}
                                        link={item.link}
                                        id={item.id}
                                        type={item.type}
                                        share={share}
                                        isSharedPage={false}
                                        created_at={item.created_at} />
                                }
                                else {
                                    return <ThoughtCards
                                        id={item.id}
                                        title={item.title}
                                        body={item.body}                       
                                        created_at={item.created_at}
                                        share={share}
                                        isSharedPage={false} />
                                }
                            
                        })}
                </Masonry>
            </motion.div>

                <div className="pt-1 p-2 absolute right-0 top-0 flex">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-md mt-4 mr-3">
                        <ModeToggle variable="ghost" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="sm" text="Thoughts" bg_color="defaultTheme"
                            fullWidth={false} shadow={false} startIcon={<BookOpen size="18" className="mr-1" />}
                            onClick={() => setThoughtModalOpen(true)}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="sm" text="Content" bg_color="defaultTheme"
                            fullWidth={false} shadow={false} startIcon={<Plus size="18" className="mr-1" />}
                            onClick={() => setContentModalOpen(true)}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="sm" text={`Share Brain: ${share ? 'OFF' : 'ON'}`} bg_color="defaultTheme"
                            fullWidth={false} shadow={false} startIcon={<Share size="18" className="mr-1" />}
                            onClick={handleShare}
                        />
                    </motion.div>
                </div>
            </div>
        </div >
    )
}
