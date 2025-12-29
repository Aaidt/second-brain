import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "./NativeButton"
import { toast } from 'react-toastify'
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
type modalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function CreateThoughtModal({ open, setOpen }: modalProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState<string | number | readonly string[] | undefined>('');
    const [loading, setLoading] = useState<boolean>(false)
    const [session, setSession] = useState<Session | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null)


    supabase.auth.getSession().then(({data: {session}}) => {
        setSession(session);
    })
    const token = session?.access_token;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    async function handleRequest() {
        setLoading(true)
        try {
            await axios.post(`${BACKEND_URL}/api/second-brain/thought/create`, {
                title: titleRef.current?.value,
                thoughts: textareaRef.current?.value
            }, { headers: { Authorization: `Bearer ${token}` } })

            setValue("");

            toast.success("Content added sucessfully!!!");
        } catch (err) {
            toast.error('Could not add the thought due to: ')
            console.error(err)
        } finally {
            setLoading(false)
        }

    }

    return (open &&
        <div onClick={() => { 
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm bg-black/70 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-md w-[1000px] max-h-[90vh] overflow-y-auto flex flex-col gap-4 
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] p-5 text-foreground/90">
                    <div className="font-bold font-playfair text-4xl pb-3 flex justify-center">Add Thoughts</div>
                    <div className="">
                        <div className="m-2">
                            <input ref={titleRef}
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        textareaRef.current?.focus()
                                    }
                                }}
                                className="w-full rounded-md text-xl font-medium p-2 border border-foreground/20"
                                placeholder="Title..."
                                disabled={loading} />
                        </div>
                        <div className="m-2">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-[900px] resize-none overflow-hidden  bg-transparent outline-none text-xl leading-relaxed"
                                placeholder="Start typing..."
                                style={{
                                    border: "none",
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRequest()
                                        setOpen(!open)
                                    }
                                }}
                                disabled={loading}
                            />
                        </div>

                        <div className="font-bold pr-3">
                            <Button 
                                loading={loading}
                                hover={false} shadow={false}
                                size="md" text="Submit"
                                bg_color="defaultTheme"
                                fullWidth={true}
                                onClick={() => {
                                    handleRequest()
                                    setOpen(!open)
                                }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
