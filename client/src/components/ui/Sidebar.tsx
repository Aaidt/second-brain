import { useState } from "react";
import { BrainIcon } from "../icons/BrainIcon";
import { CloseBarIcon } from "../icons/CloseBarIcon";
import { OpenBarIcon } from "../icons/OpenBarIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { RedditIcon } from "../icons/RedditIcon";
import { FullBrainIcon } from "../icons/FullBrainIcon";
import { SideBarItems } from "./SideBarItems";

export const Sidebar = () => {
  const [sidebarClose, setSidebarClose] = useState(false);

  return (
    <div
      className={`h-full min-h-screen bg-[#183B4E] border-black rounded-r transition-all duration-300 ease-in-out ${
        sidebarClose ? "w-15" : "w-72"
      }`}
    >
      <div
        className={`p-3 hover:scale-105 cursor-pointer transition-transform duration-200 ${
          sidebarClose ? "text-center" : ""
        }`}
        onClick={() => setSidebarClose(!sidebarClose)}
      >
        {sidebarClose ? <OpenBarIcon /> : <CloseBarIcon />}
      </div>

      {!sidebarClose && (
        <>
          <div className="flex p-2 font-bold text-3xl text-[#DDA853] items-center gap-3">
            <BrainIcon /> Second Brain
          </div>
          <div>
            <SideBarItems text="My brain" icon={<FullBrainIcon />} />
            <SideBarItems text="Twitter" icon={<TwitterIcon />} />
            <SideBarItems text="YouTube" icon={<YoutubeIcon />} />
            <SideBarItems text="Reddit" icon={<RedditIcon />} />
            {/* <SideBarItems text="Others" /> */}
          </div>
        </>
      )}
    </div>
  );
};
