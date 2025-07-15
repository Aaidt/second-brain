import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ThoughtModal } from "./ThoughtModal";
import { useState } from 'react'
import { Hover } from "@/components/ui/Hover"


interface ThoughtCardPropTypes {
    title: string,
    body: string,
    id?: string,
    share?: boolean,
    isSharedPage: boolean,
    created_at: Date 
}

export function ThoughtCards(ThoughtCardProps: ThoughtCardPropTypes) {
    // const sentences = ThoughCardProps.thoughts.split(/[.!?]+/).slice(0, 3).join('. ') + '.';
    const [open, setOpen] = useState<boolean>(false)
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

    return (<div>
        <ThoughtModal title={ThoughtCardProps.title} thought={ThoughtCardProps.body} open={open} setOpen={setOpen} />

        <div className={`min-w-72 min-h-96 shadow shadow-black/45 border border-black/30 bg-white rounded-md m-2 font-playfair`}>
            <div className="flex justify-between pt-4 p-3 transition-all duration-300 ">
                <div onClick={() => {
                    setOpen(true)
                }}>
                    <div
                        className="relative"
                        onMouseEnter={() => setHoveredIcon('View')}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        {hoveredIcon === 'View' && <Hover component="View" />}
                        <Page /> </div>
                </div>

                <div className="flex gap-4">
                    {(ThoughtCardProps.isSharedPage === false) ? (
                        <div
                        className="relative"
                        onMouseEnter={() => setHoveredIcon('Delete')}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        {hoveredIcon === 'Delete' && <Hover component="Delete" />}
                        <Delete ThoughtId={ThoughtCardProps.id} /></div>
                        ) : null}
                </div>
            </div>
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-medium mb-4 ">{ThoughtCardProps.title}</h1>
                <div className="relative">
                    <p className="line-clamp-10 font-roboto" style={{ whiteSpace: 'pre-wrap' }}>
                        {ThoughtCardProps.body}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                </div>
            </div>
        </div >
    </div>

    )
}



