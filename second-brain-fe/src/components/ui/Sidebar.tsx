// import React from "react";
import { BrainIcon } from "../icons/BrainIcon"
import { CloseBarIcon } from "../icons/CloseBarIcon"


export const Sidebar = () => {
    return (
        <div className="h-screen bg-green-400 w-72 border-black">
            <div className="">
                <div className="p-3 hover:-translate-x-1 duration-500">
                    {<CloseBarIcon />}
                </div>
                <div className="flex p-2 font-bold text-3xl items-center gap-3">
                    {<BrainIcon />}  Second Brain
                </div>
            </div>

        </div>
    )
}