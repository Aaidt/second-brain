import { Button } from "../components/ui/Button"
import { Sidebar } from "../components/ui/Sidebar"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"
import { CardComponent } from "../components/ui/CardComponent"
import { CreateContentModal } from "../components/ui/createContentModal"
import { useState, useEffect } from "react";
import { useContent } from "../hooks/useContent"
import axios from "axios";

export const Dashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

    const [modalOpen, setModalOpen] = useState(false);
    const { contents, refresh } = useContent()
    const [share, setShare] = useState(true)

    useEffect(() => {
        refresh()
    }, [modalOpen])

    interface ResponseData {
        link: string
    }

    async function handleShare() {
        setShare(!share)
        try {
            const response = await axios.post<ResponseData>(`${BACKEND_URL}/api/v1/second-brain/share`,
                {
                    share: share
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("authorization")
                    }
                });
            {
                share ? (alert("Share this link to give access to others: " + `${CLIENT_URL}${'/'}${response.data?.link}`)) : (
                    alert("You have tuned OFF sharing now. Click the button again to turn it ON")
                )
            }
        }
        catch (err) {
            alert('err:' + err);
        }
    }

    return (
        <>
            <CreateContentModal open={modalOpen} setOpen={setModalOpen} />
            <div className="bg-[#F5EEDC] flex font-serif text-[#DDA853]">
                <div>
                    <Sidebar />
                </div>
                <div className="flex p-4 pt-20 flex-wrap">
                    {contents.map(({ title, link, type, _id }) =>
                        <CardComponent title={title} type={type} link={link} id={_id} />
                    )}
                    <div className="pt-1 p-2 fixed right-0 top-0 flex">
                        <div className="">
                            <Button
                                size="md" text="Add content" bg_color="gold"
                                fullWidth={false} startIcon={<PlusIcon />}
                                onClick={() => setModalOpen(true)}
                            />
                        </div>
                        <div className="">
                            <Button
                                size="md" text="Share Brain" bg_color="gold"
                                fullWidth={false} startIcon={<ShareIcon style='float' />}
                                onClick={handleShare}
                            />
                        </div>
                    </div>
                </div>


            </div>


        </>
    )
}
