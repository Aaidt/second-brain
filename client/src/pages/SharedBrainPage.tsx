import { Sidebar } from "../components/ui/Sidebar"
import { CardComponent } from "../components/ui/CardComponent"
import { useState, useEffect } from "react";
import { useContent } from "../hooks/useContent"
import { SearchBar } from "../components/ui/SearchBar"
import { useSideBar } from "../hooks/sidebarContext";
import Masonry from "react-masonry-css"
import { useThoughts } from "../hooks/useThoughts"
import { ThoughtCards } from "../components/ui/ThoughtCards"
export const SharedBrainPage = () => {

    const [type, setType] = useState<string | undefined>()

    const [modalOpen, setModalOpen] = useState(false);
    const { contents, refresh } = useContent()
    const { thoughts, reFetch } = useThoughts()
    const [thoughtModalOpen, setThoughtModalOpen] = useState(false);

    useEffect(() => {
        reFetch()
    }, [thoughtModalOpen])

    useEffect(() => {
        refresh()
    }, [modalOpen])

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
        <div className="min-h-screen h-full w-full min-h-full bg-[#F5EEDC] font-serif text-[#DDA853]">
            <div className="fixed top-0 left-0 mr-5">
                <Sidebar type={type} setType={setType} />
            </div>
            <div className={`flex ${sidebarClose ? 'pl-20' : 'pl-75'} duration-200 text-md pt-5 p-1`}>
                <SearchBar />
            </div>

            <div className={`${`${sidebarClose ? 'pl-20' : 'pl-75'} p-4 pt-10 duration-200 gap-4`}`}>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto"
                    columnClassName="pl- bg-clip-padding"
                >
                    {contents.filter((contents) => !type || contents.type?.trim() === type.trim())
                        .map(({ title, link, type, _id }) =>
                            <div key={_id} className="mb-4">
                                <CardComponent title={title} type={type} link={link} id={_id} />
                            </div>
                        )}

                    {thoughts?.filter((thoughts) => {
                            return !type || type?.trim() === "thoughts"
                        })
                        .map(({ title, thoughts, _id }) =>
                            <div key={_id} className="mb-4">
                                <ThoughtCards title={title} thoughts={thoughts} id={_id} />
                            </div>
                        )
                    }
                </Masonry>
            </div>
        </div>
    )
}
