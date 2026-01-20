import { Delete } from "../icons/Delete"
import { FileText } from "lucide-react";

interface ThoughtCardPropTypes {
    title: string,
    body: string,
    id?: string,
    share?: boolean,
    isSharedPage: boolean,
    created_at: Date,
    onView?: () => void
}

export function ThoughtCards(ThoughtCardProps: ThoughtCardPropTypes) {
    // const sentences = ThoughCardProps.thoughts.split(/[.!?]+/).slice(0, 3).join('. ') + '.';
    // const [open, setOpen] = useState<boolean>(false) removed unused state

    return (<div>
        <div className={`max-w-80 max-h-100 overflow-hidden border border-white/10 bg-[#111] text-gray-300 rounded-2xl mt-6 font-playfair mx-2 shadow-xl hover:border-teal-500/30 transition-colors`}>
            <div className="flex justify-between pt-4 p-3 transition-all duration-300 ">
                <div onClick={() => {
                   if (ThoughtCardProps.onView) {
                       ThoughtCardProps.onView()
                   }
                }}>
                    <div className="relative"> <FileText className="cursor-pointer text-gray-400 hover:text-gray-200 transition-colors" strokeWidth="1.5" size="20" /> </div>
                </div>

                <div className="flex gap-4">
                    {(ThoughtCardProps.isSharedPage === false) ? (
                        <div className="relative">
                        <Delete ThoughtId={ThoughtCardProps.id} /></div>
                        ) : null}
                </div>
            </div>
            <div className="flex flex-col p-4 max-h-100 cursor-pointer" onClick={() => ThoughtCardProps.onView && ThoughtCardProps.onView()}>
                <h1 className="text-2xl font-medium mb-4 line-clamp-2 break-words break-all text-gray-200">{ThoughtCardProps.title}</h1>
                <div className="relative">
                    <p className="line-clamp-10 font-roboto text-gray-400" style={{ whiteSpace: 'pre-wrap' }}>
                        {ThoughtCardProps.body}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#111] to-transparent"></div>
                </div>
            </div>
        </div >
    </div>

    )
}



