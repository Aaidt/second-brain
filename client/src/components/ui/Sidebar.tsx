import { BrainIcon } from "../icons/BrainIcon";
import { CloseBarIcon } from "../icons/CloseBarIcon";
import { OpenBarIcon } from "../icons/OpenBarIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { RedditIcon } from "../icons/RedditIcon";
import { SideBarItems } from "./SideBarItems";
import { useSideBar } from "../../hooks/sidebarContext"
import { Button } from "./Button"
import { useNavigate } from "react-router-dom"

export const Sidebar = () => {
  const navigate = useNavigate()
  const { sidebarClose, setSidebarClose } = useSideBar()

  const Logout = () => {
    localStorage.removeItem("authorization");
    navigate("/signin");
  }

  return (
    <div
      className={`h-full min-h-screen bg-[#183B4E] border-black rounded-r transition-all duration-500 ease-in-out overflow-hidden 
        ${sidebarClose ? "w-15" : "w-72"
        }`}
    >
      <div
        className={`p-3 hover:scale-105 cursor-pointer transition-transform duration-300 ${sidebarClose ? "text-center" : ""
          }`}
        onClick={() => setSidebarClose(!sidebarClose)}
      >
        {sidebarClose ? <OpenBarIcon /> : <CloseBarIcon />}
      </div>

      {!sidebarClose && (
        <>
          <div className="flex p-2 font-bold font-playfair text-5xl text-[#DDA853] items-center gap-3">
            <p className="pl-6">Second Brain</p>
          </div>
          <div className="pt-2">
            <SideBarItems text="My brain" icon={<BrainIcon />} />
            <SideBarItems text="Twitter" icon={<TwitterIcon />} />
            <SideBarItems text="YouTube" icon={<YoutubeIcon />} />
            <SideBarItems text="Reddit" icon={<RedditIcon />} />
          </div>

          <div className="pr-5 text-xl pt-2 pl-1 font-semibold"
          onClick={Logout}>
            <Button size="md" text="Logout" bg_color="gold" fullWidth={true} shadow={false} />
          </div>
        </>
      )}
    </div>
  );
};
