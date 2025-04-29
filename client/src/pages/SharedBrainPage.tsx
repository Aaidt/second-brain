import { Sidebar } from "../components/ui/Sidebar"
import { CardComponent } from "../components/ui/CardComponent"
import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";

interface ContentType {
    title: string,
    type: "youtube" | "twitter" | "reddit" | "others",
    link: string,
    _id: string
}

interface ResponseData {
    content: ContentType[]
}

export const SharedBrainPage = () => {
    const [contents, setContents] = useState<ContentType[]>([])
    const { shareLink } = useParams();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchSharedContent = async () => {
            try {
                const response = await axios.post<ResponseData>(`${BACKEND_URL}/api/v1/second-brain/${shareLink}`)
                setContents(response.data?.content || [])
            } catch (err) {
                console.log(err)
            }
        }
        fetchSharedContent()

    }, [shareLink])

    return (
        <div>
            <div className="bg-[#F5EEDC] flex font-serif text-[#DDA853]">
                <div>
                    <Sidebar />
                </div>
                <div className="flex p-4 pt-20 flex-wrap">
                    {contents.map(({ title, link, type, _id }) =>
                        <CardComponent share={true} key={_id} title={title} type={type} link={link} />
                    )}
                </div>
            </div>
        </div>
    )
}
