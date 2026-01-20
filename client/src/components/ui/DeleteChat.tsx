import { Dispatch, SetStateAction, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export function DeleteChat({
    open,
    setOpen,
    onDeleteSuccess,
    sessionId
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onDeleteSuccess: () => void;
    sessionId: string
}) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

  async function deleteChats() {
    if(!session?.access_token) return 
    try {
            await axios.delete(`${BACKEND_URL}/api/second-brain/chatSession/delete/${sessionId}`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            onDeleteSuccess();
            toast.success("Chats deleted successfully!");
            setOpen(false);
        } catch (err) {
            console.error("Error deleting chats:", err);
            toast.error("Failed to delete chats.");
            setOpen(false);
        }
  }

  return (
    open && (
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 h-screen w-screen backdrop-blur-md bg-black/80 z-[200] flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111] border border-white/10 rounded-2xl w-[400px] flex flex-col p-8 opacity-0 scale-95 
            animate-[appear_0.3s_ease-out_forwards] font-sans shadow-2xl"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Delete Chat?</h3>
            <p className="text-white/50 text-sm">
                This action is permanent and cannot be undone. All messages in this session will be lost.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={deleteChats}
              className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium text-sm"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    )
  );
}