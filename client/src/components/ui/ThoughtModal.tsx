import { Dispatch, SetStateAction } from "react"

interface modalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    thought: string,
    title: string
}

export function ThoughtModal({ open, setOpen, thought, title }: modalProps) {

    return (open &&
        <div onClick={() => {
            setOpen(false)
        }} className="fixed top-0 left-0 h-screen w-screen backdrop-blur-md bg-black/70 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-[#F0ECE3] rounded-md w-[1000px] max-h-[90vh] overflow-y-auto
                 flex flex-col gap-4 opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] p-8 text-black">

                    <div className="font-medium font-playfair text-4xl pb-3 flex justify-center">
                        {title}
                    </div>

                    <div className="text-lg font-roboto" style={{ whiteSpace: 'pre-wrap' }}>
                        {thought}
                    </div>

                </div>
            </div>
        </div>
    )
}