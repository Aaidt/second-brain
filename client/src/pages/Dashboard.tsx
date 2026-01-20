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
import { ThoughtModal } from "@/components/ui/ThoughtModal";
// cleaned imports
import { CreateThoughtModal } from "@/components/ui/createThoughtModal";
import { useThoughts } from "../hooks/useThoughts"
import { ThoughtCards } from '../components/ui/ThoughtCards';
import { motion } from 'framer-motion'
// import { toast } from "react-toastify"
import { supabase } from "@/lib/supabase"
import { Plus, BookOpen } from "lucide-react"
import { Session } from "@supabase/supabase-js";
// import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    // const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
    // const navigate = useNavigate();

    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session);
        });
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
    
        return () => subscription.unsubscribe();
      }, []);

    useEffect(() => {
        async function syncUser() {
            if (session?.access_token) {
                try {
                    await axios.post(`${BACKEND_URL}/api/second-brain/auth/sync-user`, {}, {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    });
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            }
        }
        syncUser();
    }, [session, BACKEND_URL]);

    // if(!session){
    //     alert("User is not logged in!!!");
    //     navigate("/login");
    // }

    const [type, setType] = useState<string | undefined>()

    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [thoughtModalOpen, setThoughtModalOpen] = useState(false);
    const [, setShowSearch] = useState(false); // Dummy state to trigger re-render on search input
    // const [share, setShare] = useState(true)

    const { content, refresh } = useContent()
    const { thoughts, reFetch } = useThoughts()

    useEffect(() => {
        reFetch()
        refresh()
    }, [])

    const pageContent = [
        ...content.map(items => ({ ...items, category: "content" }) as ContentType),
        ...thoughts.map(items => ({ ...items, category: "thoughts" }) as ThoughtType)
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

    // interface ResponseData {
    //     link: string
    // }

    // function alertUser(share: boolean, responseData: ResponseData) {
    //     if (share) {
    //         toast.success("Share this link to give access to others:⚡" + `${CLIENT_URL}${'/share/'}${responseData?.link}`)
    //     } else {
    //         toast.error("You have tuned OFF sharing now. Click the button again to turn it ON")
    //     }
    // }


    // async function handleShare() {
    //     if(!session?.access_token) return console.log("no access token: ", session?.access_token);
    //     setShare(!share)
    //     try {
    //         const response = await axios.post<ResponseData>(`${BACKEND_URL}/api/second-brain/link/share`, { share },
    //             { headers: { Authorization: `Bearer ${session.access_token}` } });

    //         if (!response) {
    //             toast.error('Issue with the Backend response')
    //         }

    //         alertUser(share, response.data)
    //     }
    //     catch (err) {
    //         toast.error('err:' + err);
    //     }
    // }

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
    const [selectedThought, setSelectedThought] = useState<{title: string, body: string} | null>(null);

    return (
        <div className="min-h-screen min-h-full w-full bg-[#050505] text-[#E5E5E5] selection:bg-teal-500/30 selection:text-teal-200 font-sans antialiased overflow-x-hidden relative">
            {/* NOISE GRAIN OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* REFINED BACKGROUND ACCENTS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-teal-500/5 blur-[140px]" />
                <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[140px]" />
            </div>

            <CreateContentModal open={contentModalOpen} setOpen={setContentModalOpen} />
            <CreateThoughtModal open={thoughtModalOpen} setOpen={setThoughtModalOpen} />
            
            {/* VIEW THOUGHT MODAL - Rendered at root to escape clipping */}
            <ThoughtModal 
                open={selectedThought !== null} 
                setOpen={(val) => !val && setSelectedThought(null)} 
                title={selectedThought?.title || ""} 
                thought={selectedThought?.body || ""} 
            />


            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-0 left-0 mr-5 z-20">
                <Sidebar type={type} setType={setType} />
            </motion.div>
            <div className={`flex flex-col md:flex-row items-center justify-between ${sidebarClose ? 'pl-20' : 'pl-70'} duration-200 pt-8 pr-8 gap-4 relative z-10`}>
                <div className="w-full md:w-auto">
                    <SearchBar ref={searchRef} onChange={() => setShowSearch(prev => !prev)} /> 
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        hover={true}
                        size="sm" text="Thoughts" bg_color="defaultTheme"
                        fullWidth={false} shadow={false} startIcon={<BookOpen size="16" className="mr-2" strokeWidth="2" />}
                        onClick={() => setThoughtModalOpen(true)}
                    />
                    <Button
                        hover={true}
                        size="sm" text="Content" bg_color="defaultTheme"
                        fullWidth={false} shadow={false} startIcon={<Plus size="18" className="mr-1" strokeWidth="2" />}
                        onClick={() => setContentModalOpen(true)}
                    />
                </div>
            </div>

            <div className={`${sidebarClose ? 'pl-20' : 'pl-70'} p-4 pt-6 duration-200 relative z-10`}>

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
                                if (!selectedType) return true;

                                if (['twitter', 'youtube', 'reddit', 'others'].includes(selectedType)) {
                                    return content.category === "content" && content.type?.trim() === selectedType
                                }

                                if (selectedType === "thoughts") {
                                    return content.category === "thoughts"
                                }

                                return true

                            }).map(item => {
                                if (item.category === "content") {
                                    return <CardComponent
                                        key={item.id}
                                        title={item.title}
                                        link={item.link}
                                        id={item.id}
                                        type={item.type}
                                        // share={share}
                                        isSharedPage={false}
                                        created_at={item.created_at} />
                                }
                                else {
                                    return <ThoughtCards
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        body={item.body}
                                        created_at={item.created_at}
                                        // share={share}
                                        isSharedPage={false} 
                                        onView={() => setSelectedThought({title: item.title, body: item.body})}
                                        />
                                }

                            })}
                    </Masonry>
                </motion.div>
            </div>
        </div >
    )
}
