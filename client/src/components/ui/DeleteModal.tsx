import { Dispatch, SetStateAction } from "react";
import { useContent } from "../../hooks/useContent"
import { toast } from 'react-toastify'
import { useThoughts } from "../../hooks/useThoughts"
import axios from "axios";
import { getAccessToken, refreshAccessToken } from "../../auth";

export function DeleteModal({ open, setOpen, contentId, ThoughtId }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    contentId?: string,
    ThoughtId?: string
}) {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const { refresh } = useContent();
    const { reFetch } = useThoughts();

    async function deletePost() {
        try {
            let token = getAccessToken();
            if (!token) {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                await refreshAccessToken(BACKEND_URL).then(newToken => {
                    token = newToken;
                });
            }
            if (contentId) {
                await axios.request({
                    method: 'DELETE',
                    url: `${BACKEND_URL}/second-brain/api/content/deleteOne`,
                    data: { contentId: contentId },
                    headers: { Authorization: `Bearer ${token}` }
                })
                refresh()
                toast.success("Content has been deleted successfully!!!")
                setOpen(false)
            }

            else if (ThoughtId) {
                await axios.delete(`${BACKEND_URL}/second-brain/api/thought/delete/${ThoughtId}`, {
                    headers: {
                         Authorization: `Bearer ${token}` 
                        }})
                reFetch()
                toast.success("Thought has been deleted successfully!!!")
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
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-md w-122 h-35 flex flex-col  text-black 
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards] font-inter justify-center items-center ">
                <p className="text-md text-center pt-2">You will delete this post permenantly on pressing delete. <br />
                    Do you still want to proceed?
                </p>
                <div className="flex gap-10 pt-4 ">
                    <button
                        onClick={() => { setOpen(!open) }}
                        className="bg-black/95 duration-200 transition-all 
                        hover:bg-black/85 px-6 py-2 rounded-sm border border-black/30 text-white">
                        Back
                    </button>

                    <button
                        onClick={() => { deletePost() }}
                        className="bg-red-900 duration-200 transition-all 
                        hover:bg-red-800 border px-6 py-2 rounded-sm border border-black/10 text-white">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}