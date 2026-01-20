import { useState, useRef, Dispatch, useEffect, SetStateAction } from "react";
import { Button } from "./NativeButton"
import { DropDownMenu } from "./native-dropdown-menu"
import { toast } from "react-toastify"
import axios from "axios";
import { supabase } from "@/lib/supabase"; 
import { Session } from "@supabase/supabase-js";
type modalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function CreateContentModal({ open, setOpen }: modalProps) {
    const [selectedVal, setSelectedVal] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [session, setSession] = useState<Session | null>(null);
    const titleRef = useRef<HTMLInputElement>(null)
    const linkRef = useRef<HTMLInputElement>(null)
    const type = selectedVal

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

    const handleRequest = async () => {
        setLoading(true)
        if(!session?.access_token) return;

        try{
            await axios.post(`${BACKEND_URL}/api/second-brain/content/create`, {
                title: titleRef.current?.value,
                link: linkRef.current?.value,
                type
            }, { headers: { Authorization: `Bearer ${session?.access_token}` } })
            toast.success("Content added sucessfully!!!");
        }catch(err){
            console.error(err);
            toast.error("Error while deleting content.")
        } finally {
            setLoading(false)
        }
    }

    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed inset-0 h-screen w-screen bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10 w-full">
                <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl w-[500px] max-w-[90vw] flex flex-col gap-6 p-8 text-gray-200
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] relative">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-[60px] rounded-full pointer-events-none" />

                    <div className="font-bold font-playfair text-3xl pb-2 text-center text-white border-b border-white/5">ADD CONTENT</div>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="mb-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-teal-500/80 mb-2 block">Title</label>
                                <input ref={titleRef} 
                                onKeyDown={(e) => {
                                    if(e.key === "Enter"){
                                        e.preventDefault();
                                        linkRef.current?.focus()
                                    }
                                }}
                                type="text" 
                                className="w-full bg-[#0A0A0A] rounded-xl p-3 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 outline-none transition-all placeholder:text-gray-600"
                                placeholder="Title..." disabled={loading} />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-teal-500/80 mb-2 block">Link</label>
                                <input ref={linkRef} type="text" className="w-full bg-[#0A0A0A] rounded-xl p-3 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Paste the URL here..." disabled={loading} />
                            </div>
                        </div>

                        <div>
                            <div className="mb-6">
                                <label className="text-xs font-bold uppercase tracking-widest text-teal-500/80 mb-2 block">Type</label>
                                <DropDownMenu
                                    options={[
                                        { label: "YouTube", value: "youtube" },
                                        { label: "X", value: "twitter" },
                                        { label: "Reddit", value: "reddit" },
                                        { label: "Others", value: "others" },
                                    ]}
                                    onSelect={(val) => setSelectedVal(val)}
                                />
                            </div>

                            <div className="font-bold flex justify-end">
                                <Button hover={true}
                                    shadow={false} size="lg"
                                    text="Add Content" bg_color="defaultTheme"
                                    fullWidth={false}
                                    onClick={() => {
                                        handleRequest()
                                        setOpen(!open)
                                    }} loading={loading}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
