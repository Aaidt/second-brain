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


    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session);
        });
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
    
        return () => subscription.unsubscribe();
      }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    async function handleRequest() {
        setLoading(true)
        if(!session?.access_token) return;
        try {
            await axios.post(`${BACKEND_URL}/api/second-brain/thought/create`, {
                title: titleRef.current?.value,
                thoughts: textareaRef.current?.value
            }, { headers: { Authorization: `Bearer ${session?.access_token}` } })

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
        }} className="fixed inset-0 h-screen w-screen backdrop-blur-md bg-black/80 z-[100] flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10 w-full">
                <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl w-[900px] max-w-[90vw] max-h-[85vh] overflow-y-auto flex flex-col gap-4 
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] p-6 text-gray-200 relative">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-[60px] rounded-full pointer-events-none" />

                    <div className="font-bold font-playfair text-3xl pb-2 text-center text-white border-b border-white/5">CAPTURE THOUGHT</div>
                    
                    <div className="space-y-4">
                        <div className="">
                            <label className="text-xs font-bold uppercase tracking-widest text-teal-500/80 mb-2 block">Title</label>
                            <input ref={titleRef}
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        textareaRef.current?.focus()
                                    }
                                }}
                                className="w-full bg-[#0A0A0A] rounded-xl text-xl font-medium p-3 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="What's on your mind?"
                                disabled={loading} />
                        </div>
                        <div className="">
                            <label className="text-xs font-bold uppercase tracking-widest text-teal-500/80 mb-2 block">Elaboration</label>
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full min-h-[150px] resize-none bg-[#0A0A0A] rounded-xl text-lg p-3 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 outline-none transition-all leading-relaxed placeholder:text-gray-600"
                                placeholder="Start typing..."
                                style={{
                                    height: "auto",
                                }}
                                disabled={loading}
                            />
                        </div>

                        <div className="font-bold pt-2 flex justify-end">
                            <Button 
                                loading={loading}
                                hover={true} shadow={false}
                                size="lg" text="Create Thought"
                                bg_color="defaultTheme"
                                fullWidth={false}
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
