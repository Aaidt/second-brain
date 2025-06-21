import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "./Button"
import { toast } from 'react-toastify'
import axios from "axios";

type modalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function CreateThoughtModal({ open, setOpen }: modalProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState<string | number | readonly string[] | undefined>('');
    const [loading, setLoading] = useState<boolean>(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    async function handleRequest() {
        setLoading(true)
        try {
            await axios.post(`${BACKEND_URL}/api/v1/second-brain/thoughts`, {
                title: titleRef.current?.value,
                thoughts: textareaRef.current?.value
            }, {
                headers: {
                    "Authorization": localStorage.getItem("authorization")
                }
            })
            setLoading(false)
            setValue("");
            toast.success("Content added sucessfully!!!");
        } catch (err) {
            toast.error('Could not add the thought due to: ' + err)
        }

    }

    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-md w-[1000px] max-h-[90vh] overflow-y-auto flex flex-col gap-4 
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] p-5 text-black">
                    <div className="font-bold font-playfair text-4xl pb-3 flex justify-center">Add Thoughts</div>
                    <div className="">
                        <div className="m-2">
                            <input ref={titleRef} type="text" className="w-full rounded-md p-2 border"
                                placeholder="Title..." />
                        </div>
                        <div className="m-2">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-[900px] resize-none overflow-hidden bg-transparent outline-none text-xl leading-relaxed"
                                placeholder="Start typing..."
                                style={{
                                    border: "none",
                                }}
                            />
                        </div>

                        <div className="font-bold pr-3">
                            <Button
                                loading={loading}
                                hover={true} shadow={false}
                                size="md" text="Submit"
                                bg_color="black"
                                fullWidth={true}
                                onClick={() => {
                                    handleRequest()
                                    setOpen(!open)
                                }} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
