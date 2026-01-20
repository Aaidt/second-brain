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
        }} className="fixed inset-0 h-screen w-screen bg-black/80 backdrop-blur-md z-[200] flex justify-center items-center">
             <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111] border border-white/10 rounded-2xl w-[400px] flex flex-col p-8 opacity-0 scale-95 
            animate-[appear_0.3s_ease-out_forwards] font-sans shadow-2xl"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Delete Item?</h3>
            <p className="text-white/50 text-sm">
                This action is permanent. Are you sure you want to remove this?
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setOpen(!open) }}
              className="px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => { deletePost() }}
              className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        </div>
    )
}