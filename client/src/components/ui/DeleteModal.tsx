import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useContent } from "../../hooks/useContent"
import { toast } from 'react-toastify'
import { useThoughts } from "../../hooks/useThoughts"
import axios from "axios";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function DeleteModal({ open, setOpen, contentId, ThoughtId }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    contentId?: string,
    ThoughtId?: string
}) {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const { refresh } = useContent();
    const { reFetch } = useThoughts();
    const [session, setSession] = useState<Session | null>(null);

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

    async function deletePost() {
        if(!session?.access_token) return 
        try {
            if (contentId) {
                try{
                    await axios.delete(`${BACKEND_URL}/api/second-brain/content/deleteOne/${contentId}`,{
                            headers: { Authorization: `Bearer ${session?.access_token}` }
                        }
                    )
                    refresh()
                    toast.success("Content has been deleted successfully!!!")
                }catch(err){
                    console.error(err)
                }
                setOpen(false)
            }

            else if (ThoughtId) {
                try{
                    await axios.delete(`${BACKEND_URL}/api/second-brain/thought/delete/${ThoughtId}`, {
                        headers: {
                             Authorization: `Bearer ${session?.access_token}` 
                            }})
                    reFetch()
                    toast.success("Thought has been deleted successfully!!!")
                }catch(err){
                    console.error(err)
                }
                setOpen(false)
            }
        } catch (err) {
            console.error("Error deleting item: " + err)
            toast.error("Failed to delete item.")
            setOpen(false)
        }
    }

    return (open &&
        <div onClick={() => {
            setOpen(false)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center">
            <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-md w-122 h-35 flex flex-col  text-foreground 
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] font-inter justify-center items-center ">
                <p className="text-md text-center pt-2">You will delete this post permenantly on pressing delete. <br />
                    Do you still want to proceed?
                </p>
                <div className="flex gap-10 pt-4 ">
                    <button
                        onClick={() => { setOpen(!open) }}
                        className="bg-foreground/95 duration-200 transition-all 
                        hover:bg-foreground/70 cursor-pointer px-6 py-2 rounded-sm border border-black/30 text-background font-medium">
                        Back
                    </button>

                    <button
                        onClick={() => { deletePost() }}
                        className="bg-red-900 duration-200 transition-all 
                        hover:bg-red-800 border px-6 py-2 cursor-pointer rounded-sm border border-black/10 text-white font-medium">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}