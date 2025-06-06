import { useContent } from "../../hooks/useContent"
import { useThoughts } from "../../hooks/useThoughts"
import axios from "axios";

export const Delete = ({contentId, ThoughtId}: {contentId?: string, ThoughtId?: string}) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const { refresh } = useContent();
    const { reFetch } = useThoughts();

    const deletePost = async () => {
        try {
            if (contentId) {
                await axios.request({
                    method: 'DELETE',
                    url: `${BACKEND_URL}/api/v1/second-brain/content`,
                    data: {
                        contentId: contentId
                    },
                    headers: {
                        "Authorization": localStorage.getItem("authorization")
                    }
                })
                refresh()
                alert("Content has been deleted successfully!!!")
            } 
            
            else if (ThoughtId) {
                await axios.request({
                    method: 'DELETE',
                    url: `${BACKEND_URL}/api/v1/second-brain/thoughts`,
                    data: {
                        thoughtId: ThoughtId
                    },
                    headers: {
                        "Authorization": localStorage.getItem("authorization")
                    }
                })
                reFetch()
                alert("Thought has been deleted successfully!!!")
            }
        } catch (err) {
            console.log("Error deleting item: " + err)
            alert("Failed to delete item.")
        }
    }

    return <div onClick={deletePost} >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor"
            className="cursor-pointer duration-200 hover:scale-110 size-6">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>

    </div>
}