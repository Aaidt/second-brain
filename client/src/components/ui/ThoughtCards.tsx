import { Delete } from "../icons/Delete"
import { FileText } from "lucide-react";
import { ThoughtModal } from "./ThoughtModal";
import { useState } from 'react'

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

    return (<div>
        <ThoughtModal title={ThoughtCardProps.title} thought={ThoughtCardProps.body} open={open} setOpen={setOpen} />

        <div className={`max-w-80 max-h-100 border border-foreground/30 bg-background/95 rounded-md mt-6 font-playfair`}>
            <div className="flex justify-between pt-4 p-3 transition-all duration-300 ">
                <div onClick={() => {
                    setOpen(true)
                }}>
                    <div className="relative"> <FileText className="cursor-pointer" strokeWidth="1.5" size="20" /> </div>
                </div>

                <div className="flex gap-4">
                    {(ThoughtCardProps.isSharedPage === false) ? (
                        <div className="relative">
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
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
                </div>
            </div>
        </div >
    </div>

    )
}



