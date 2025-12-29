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
        className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm bg-black/70 z-100 flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-md w-122 h-35 flex flex-col text-foreground/95 opacity-0 scale-95 
            animate-[appear_0.3s_ease-out_forwards] font-inter justify-center items-center"
        >
          <p className="text-md text-center pt-2">
            You will permanently delete all previous chats.
            <br />
            Do you still want to proceed?
          </p>
          <div className="flex gap-10 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="bg-foreground/95 duration-200 transition-all hover:bg-foreground/85 
                px-6 py-2 rounded-sm text-background cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={deleteChats}
              className="bg-red-900 duration-200 transition-all hover:bg-red-800 cursor-pointer px-6 py-2 rounded-sm text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
}