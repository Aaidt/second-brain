// import React from "react";
import { BrainIcon } from "../icons/BrainIcon"
import { CloseBarIcon } from "../icons/CloseBarIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { SideBarItems } from "./SideBarItems"

export const Sidebar = () => {
    return (
        <div className="h-screen bg-purple-500 w-72 border-black rounded-r">
            <div className="">
                <div className="p-3 hover:-translate-x-1 duration-200">
                    {<CloseBarIcon />}
                </div>
                <div className="flex p-2 font-bold text-3xl items-center gap-3">
                    {<BrainIcon />}  Second Brain
                </div>
            </div>
            <div>
                {<SideBarItems text="Twitter" icon={<TwitterIcon />} />}
                {<SideBarItems text="YouTube" icon={<YoutubeIcon />} />}
            </div>
        </div>
    )
}