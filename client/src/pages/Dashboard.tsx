import { Button } from "../components/ui/Button"
import { Sidebar } from "../components/ui/Sidebar"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"
import { CardComponent } from "../components/ui/CardComponent"
import { CreateContentModal } from "../components/ui/createContentModal"
import { useState } from "react";

export const Dashboard = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <CreateContentModal open={modalOpen} setOpen={setModalOpen} />
            <div className="bg-[#F5EEDC] flex font-serif text-[#DDA853]">
                <div>
                    <Sidebar />
                </div>
                <div className="flex p-4 flex-wrap">
                    <div className="pt-25 p-6">{<CardComponent title="asd" type="youtube" link="https://www.youtube.com/watch?v=q_edsSpDzHg&t=1192s" />}</div>
                    <div className="pt-25 p-6">{<CardComponent title="asd" type="twitter" link="https://x.com/KevinVanCott/status/1909222844891865105" />}</div>
                    <div className="pt-25 p-6">{<CardComponent title="asd" type="reddit" link="https://www.reddit.com/r/IndianWorkplace/comments/1juzqw8/my_manager_backstabbed_me/" />}</div>
                    <div className="pt-5 p-3 fixed right-0 top-0 flex">
                        <div className="">
                            <Button
                                size="md" text="Add content" bg_color="blue"
                                fullWidth={false} startIcon={<PlusIcon />}
                                onClick={() => setModalOpen(true)}
                            />
                        </div>
                        <div className="">
                            <Button
                                size="md" text="Share Brain" bg_color="blue"
                                fullWidth={false} startIcon={<ShareIcon style='float' />}
                            />
                        </div>
                    </div>
                </div>


            </div>


        </>
    )
}
