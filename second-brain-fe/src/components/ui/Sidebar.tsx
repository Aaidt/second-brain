import { useState } from "react";
import { BrainIcon } from "../icons/BrainIcon"
import { CloseBarIcon } from "../icons/CloseBarIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { RedditIcon } from "../icons/RedditIcon"
import { SideBarItems } from "./SideBarItems"


const [sidebarClose, setSidebarClose] = useState(false)

export const Sidebar = () => {
    return (
        <div className="h-screen bg-[#183B4E] w-72 border-black rounded-r">
            <div className="">
                <div
                    className="p-3 hover:-translate-x-1 duration-200"
                    onClick={() => setSidebarClose(!sidebarClose)}>
                    {<CloseBarIcon />}
                </div>
                <div className="flex p-2 font-bold text-3xl items-center gap-3">
                    {<BrainIcon />}  Second Brain
                </div>
            </div>
            <div>
                {<SideBarItems text="Twitter" icon={<TwitterIcon />} />}
                {<SideBarItems text="YouTube" icon={<YoutubeIcon />} />}
                {<SideBarItems text="Reddit" icon={<RedditIcon />} />}
            </div>
        </div>
    )
}