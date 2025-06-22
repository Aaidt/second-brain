import { Button } from "../components/ui/Button"
import { Sidebar } from "../components/ui/Sidebar"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"
import { CardComponent } from "../components/ui/CardComponent"
import { CreateContentModal } from "../components/ui/createContentModal"
import { useState, useEffect, useRef } from "react";
import { useContent } from "../hooks/useContent"
import axios from "axios";
import { SearchBar } from "../components/ui/SearchBar"
import { useSideBar } from "../hooks/sidebarContext";
import Masonry from "react-masonry-css"
import { CreateThoughtModal } from "../components/ui/addThoughts"
import { BookIcon } from "../components/icons/BookIcon"
// import { FileUploadIcon } from "../components/icons/FileUploadIcon"
import { useThoughts } from "../hooks/useThoughts"
import { ThoughtCards } from "../components/ui/ThoughtCards"
// import { useNavigate } from "react-router-dom"
import { FileUploader } from "../components/ui/FileUploader"
import { motion } from 'framer-motion'
import { toast } from "react-toastify"

export function Dashboard() {
    // const navigate = useNavigate()

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

    const [type, setType] = useState<string | undefined>()

    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [thoughtModalOpen, setThoughtModalOpen] = useState(false);
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [share, setShare] = useState(true)

    const { contents, refresh } = useContent()
    const { thoughts, reFetch } = useThoughts()

    useEffect(() => {
        reFetch()
        refresh()
    }, [])

    interface ResponseData {
        link: string
    }

    function alertUser(share: boolean, responseData: ResponseData) {
        if (share) {
            toast.success("Share this link to give access to others:⚡" + `${CLIENT_URL}${'/'}${responseData?.link}`)
        } else {
            toast.error("You have tuned OFF sharing now. Click the button again to turn it ON")
        }
    }


    async function handleShare() {
        setShare(!share)
        try {
            const response = await axios.post<ResponseData>(`${BACKEND_URL}/api/v1/second-brain/share`,
                {
                    share: share
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("authorization")
                    }
                });

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
        <div className="min-h-screen min-h-full w-full bg-white font-serif text-black/95">
            <CreateContentModal open={contentModalOpen} setOpen={setContentModalOpen} />
            <CreateThoughtModal open={thoughtModalOpen} setOpen={setThoughtModalOpen} />
            <FileUploader open={docModalOpen} setOpen={setDocModalOpen} />


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

            <div className={`${`${sidebarClose ? 'pl-20' : 'pl-75'} p-4 pt-10 duration-200 gap-4`}`}>

                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto"
                    columnClassName="pl- bg-clip-padding"
                >
                    {contents.filter((contents) => {
                        const searchVal = searchRef.current?.value.toLowerCase() || ""
                        return !searchVal || contents.title.toLowerCase().includes(searchVal)
                    })
                        .filter((contents) => {
                            const selectedType = type?.trim() || ''
                            return !selectedType || contents.type?.trim() === selectedType
                        })
                        .map(({ title, link, type, _id }) =>
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }} key={_id} className="mb-4">
                                <CardComponent title={title} type={type} link={link} id={_id} isSharedPage={false} />
                            </motion.div>
                        )
                    }

                    {thoughts?.filter((thoughts) => {
                        const searchVal = searchRef.current?.value.toLowerCase() || ""
                        return !searchVal || thoughts.title.toLowerCase() === searchVal
                    })
                        .filter(() => {
                            return !type || type?.trim() === "thoughts"
                        })
                        .map(({ title, thoughts, _id }) =>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: Number(_id) * 2 }} key={_id} className="mb-4">
                                <ThoughtCards title={title} thoughts={thoughts} id={_id} share={share} />
                            </motion.div>
                        )
                    }
                </Masonry>

                <div
                    className="pt-1 p-2 fixed right-0 top-0 flex">
                    {/* <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="md" text="Documents" bg_color="pink"
                            fullWidth={false} shadow={false} startIcon={<FileUploadIcon />}
                            onClick={() => setDocModalOpen(true)}
                        />
                    </motion.div> */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="md" text="Thoughts" bg_color="black"
                            fullWidth={false} shadow={false} startIcon={<BookIcon />}
                            onClick={() => setThoughtModalOpen(true)}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="md" text="Content" bg_color="black"
                            fullWidth={false} shadow={false} startIcon={<PlusIcon />}
                            onClick={() => setContentModalOpen(true)}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                        className="text-md">
                        <Button
                            hover={true}
                            size="md" text={`Share Brain: ${share ? 'OFF' : 'ON'}`} bg_color="black"
                            fullWidth={false} shadow={false} startIcon={<ShareIcon style='float' />}
                            onClick={handleShare}
                        />
                    </motion.div>
                </div>
            </div>
        </div >
    )
}
