import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAccessToken, refreshAccessToken } from "../../auth";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

  async function deleteChats() {
    try {
      let token = getAccessToken();
      if (!token) { token = await refreshAccessToken(BACKEND_URL) }
      if(!token){
        toast.error("Login first")
        navigate("/login")
        return 
      }
      await axios.delete(`${BACKEND_URL}/second-brain/api/chatSession/delete/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm bg-black/70 z-50 flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-md w-122 h-35 flex flex-col text-black opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] font-inter justify-center items-center"
        >
          <p className="text-md text-center pt-2">
            You will permanently delete all previous chats.
            <br />
            Do you still want to proceed?
          </p>
          <div className="flex gap-10 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="bg-black/95 duration-200 transition-all hover:bg-black/85 px-6 py-2 rounded-sm border border-black/30 text-white"
            >
              Back
            </button>
            <button
              onClick={deleteChats}
              className="bg-red-900 duration-200 transition-all hover:bg-red-800 border px-6 py-2 rounded-sm border-black/10 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
}