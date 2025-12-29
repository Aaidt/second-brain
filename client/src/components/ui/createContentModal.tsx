import { useState, useRef, Dispatch, SetStateAction } from "react";
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

    supabase.auth.getSession().then(({data: {session}}) => {
        setSession(session);
    })
    const token = session?.access_token;

    const handleRequest = async () => {
        setLoading(true)
        try{
            await axios.post(`${BACKEND_URL}/api/second-brain/content/create`, {
                title: titleRef.current?.value,
                link: linkRef.current?.value,
                type
            }, { headers: { Authorization: `Bearer ${token}` } })
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
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-md w-120 h-80 flex flex-col gap-4 p-5 text-foreground/90
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards]">
                    <div className="font-bold font-playfair text-4xl pb-1 pt-2 flex justify-center">Add Content</div>
                    <div className="">
                        <div>
                            <div className="m-2">
                                <input ref={titleRef} 
                                onKeyDown={(e) => {
                                    if(e.key === "Enter"){
                                        linkRef.current?.focus()
                                    }
                                }}
                                type="text" 
                                className="w-full rounded-md p-2 border border-foreground/20"
                                placeholder="Title..." disabled={loading} />
                            </div>
                            <div className="m-2">
                                <input ref={linkRef} type="text" className="w-full rounded-md p-2 border border-foreground/20"
                                    placeholder="Paste the URL here..." disabled={loading} />
                            </div>
                        </div>

                        <div>
                            <div className="pr-3 ">
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

                            <div className="font-bold pr-3">
                                <Button hover={false}
                                    shadow={false} size="md"
                                    text="Submit" bg_color="defaultTheme"
                                    fullWidth={true}
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
