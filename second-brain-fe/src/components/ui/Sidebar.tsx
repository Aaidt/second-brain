import { useState } from "react";
import { BrainIcon } from "../icons/BrainIcon"
import { CloseBarIcon } from "../icons/CloseBarIcon"
import { OpenBarIcon } from "../icons/OpenBarIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { RedditIcon } from "../icons/RedditIcon"
import { SideBarItems } from "./SideBarItems"


export const Sidebar = () => {

    const [sidebarClose, setSidebarClose] = useState(false)

    return <div className="">
        {sidebarClose ? (
            <div className="h-screen transition-all duration-200 hover:p-1 bg-[#183B4E]">
                <div onClick={() => setSidebarClose(!sidebarClose)}
                    className="pt-3 hover:translate-x-1">
                    {<OpenBarIcon />}
                </div>
            </div>
        ) : (
            <div className="h-screen bg-[#183B4E] w-72 border-black rounded-r transition-all duration-700">
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
        )}
    </div>
}