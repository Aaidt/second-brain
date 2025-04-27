import { Button } from "../components/ui/Button"
import { Sidebar } from "../components/ui/Sidebar"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"
import { CardComponent } from "../components/ui/CardComponent"
import { CreateContentModal } from "../components/ui/createContentModal"
import { useState, useEffect } from "react";
import { useContent } from "../hooks/useContent"
import axios from "axios";
import { SearchBar } from "../components/ui/SearchBar"
// import { Footer } from "../components/ui/Footer"
import { useSideBar } from "../hooks/sidebarContext";

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

    const { sidebarClose } = useSideBar(); 

    return (
            <div className="bg-[#F5EEDC] font-serif text-[#DDA853]">
                <CreateContentModal open={modalOpen} setOpen={setModalOpen} />

                <div className="fixed top-0 left-0">
                    <Sidebar />
                </div>
                <div className={`flex ${sidebarClose ? 'pl-20' : 'pl-75' } duration-600 text-md pt-5 p-1`}>
                    <SearchBar />
                </div>
                <div className={`flex ${sidebarClose ? 'pl-20' : 'pl-75'} p-4 pt-10 flex-wrap duration-600`}>
                    {contents.map(({ title, link, type, _id }) =>
                        <CardComponent title={title} type={type} link={link} id={_id} />
                    )}
                    <div className="pt-1 p-2 fixed right-0 top-0 flex">
                        <div className="text-md">
                            <Button
                                size="md" text="Add content" bg_color="gold"
                                fullWidth={false} shadow={false} startIcon={<PlusIcon />}
                                onClick={() => setModalOpen(true)}
                            />
                        </div>
                        <div className="text-md">
                            <Button
                                size="md" text="Share Brain" bg_color="gold"
                                fullWidth={false} shadow={false} startIcon={<ShareIcon style='float' />}
                                onClick={handleShare}
                            />
                        </div>
                    </div>
                </div>

                {/* <Footer /> */}
            </div>
    )
}
