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
import { FileUploadIcon } from "../components/icons/FileUploadIcon"
import { useThoughts } from "../hooks/useThoughts"
import { ThoughtCards } from "../components/ui/ThoughtCards"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
    const navigate = useNavigate()

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

    const [type, setType] = useState<string | undefined>()

    const [contentModalOpen, setContentModalOpen] = useState(false);

    const { contents, refresh } = useContent()
    const { thoughts, reFetch } = useThoughts()

    const [share, setShare] = useState(true)
    const [thoughtModalOpen, setThoughtModalOpen] = useState(false);

    useEffect(() => {
        reFetch()
    }, [thoughtModalOpen])

    useEffect(() => {
        refresh()
    }, [contentModalOpen])

    interface ResponseData {
        link: string
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
            {
                share ? (alert("Share this link to give access to others:⚡" + `${CLIENT_URL}${'/'}${response.data?.link}`)) : (
                    alert("You have tuned OFF sharing now. Click the button again to turn it ON")
                )
            }
        }
        catch (err) {
            alert('err:' + err);
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
        <div className="min-h-screen h-full w-full min-h-full bg-[#F5EEDC] font-serif text-[#DDA853]">
            <CreateContentModal open={contentModalOpen} setOpen={setContentModalOpen} />
            <CreateThoughtModal open={thoughtModalOpen} setOpen={setThoughtModalOpen} />

            <div className="fixed top-0 left-0 mr-5">
                <Sidebar type={type} setType={setType} />
            </div>
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
                        return !searchVal || contents.title.toLowerCase() === searchVal
                    })
                        .filter((contents) => {
                            const selectedType = type?.trim() || ''
                            return !selectedType || contents.type?.trim() === selectedType
                        })
                        .map(({ title, link, type, _id }) =>
                            <div key={_id} className="mb-4">
                                <CardComponent share={share} title={title} type={type} link={link} id={_id} />
                            </div>
                        )
                    }

                    {thoughts?.filter((thoughts) => {
                        const searchVal = searchRef.current?.value.toLowerCase() || ""
                        return !searchVal || thoughts.title.toLowerCase() === searchVal
                    })
                        .filter((thoughts) => {
                            return !type || type?.trim() === "thoughts"
                        })
                        .map(({ title, thoughts, _id }) =>
                            <div key={_id} className="mb-4">
                                <ThoughtCards title={title} thoughts={thoughts} id={_id} share={share} />
                            </div>
                        )
                    }
                </Masonry>

                <div className="pt-1 p-2 fixed right-0 top-0 flex">
                    <div className="text-md">
                        <Button
                            size="md" text="Upload documents" bg_color="gold"
                            fullWidth={false} shadow={false} startIcon={<FileUploadIcon />}
                            onClick={() => navigate("/files")}
                        />
                    </div>
                    <div className="text-md">
                        <Button
                            size="md" text="Thoughts" bg_color="gold"
                            fullWidth={false} shadow={false} startIcon={<BookIcon />}
                            onClick={() => setThoughtModalOpen(true)}
                        />
                    </div>
                    <div className="text-md">
                        <Button
                            size="md" text="Content" bg_color="gold"
                            fullWidth={false} shadow={false} startIcon={<PlusIcon />}
                            onClick={() => setContentModalOpen(true)}
                        />
                    </div>
                    <div className="text-md">
                        <Button
                            size="md" text={`Share Brain: ${share ? 'OFF' : 'ON'}`} bg_color="gold"
                            fullWidth={false} shadow={false} startIcon={<ShareIcon style='float' />}
                            onClick={handleShare}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
