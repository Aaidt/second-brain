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
        }} className="fixed inset-0 h-screen w-screen backdrop-blur-md bg-black/90 z-[9999] flex justify-center items-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto
                 flex flex-col gap-6 opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] p-8 md:p-12 text-gray-200 shadow-2xl relative scrollbar-hide">
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full pointer-events-none" />

                <div className="font-bold font-playfair text-3xl md:text-5xl text-center leading-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent pb-4 border-b border-white/5 mx-auto max-w-2xl">
                    {title}
                </div>

                <div className="text-lg md:text-xl font-serif text-gray-400 leading-loose tracking-wide" style={{ whiteSpace: 'pre-wrap' }}>
                    {thought}
                </div>

            </div>
        </div>
    )
}