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
import { UserIcon } from "../icons/UserIcon"
import { AcademicIcon } from "../icons/AcademicIcon"

interface SidebarTypes {
  type?: string | undefined,
  setType?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function Sidebar(sidebarProps: SidebarTypes) {
  const navigate = useNavigate()
  const { sidebarClose, setSidebarClose } = useSideBar()

  const Logout = () => {
    localStorage.removeItem("authorization");
    navigate("/signin");
  }

  return (
    <div
      className={`h-full min-h-screen bg-white border border-black/20 text-black/90 border-black shadow shadow-black/20
         transition-all duration-300 ease-in-out overflow-hidden 
        ${sidebarClose ? "w-15" : "w-70"
        }`}
    >
      <div
        className={`p-3 hover:scale-105 cursor-pointer transition-transform duration-200 ${sidebarClose ? "text-center" : ""
          }`}
        onClick={() => setSidebarClose(!sidebarClose)}
      >
        {sidebarClose ? <OpenBarIcon /> : <CloseBarIcon />}
      </div>

      {!sidebarClose && (
        <>
          <div className="flex font-bold font-playfair text-5xl items-center">
            <p onClick={() => navigate("/")} className="pl-6 cursor-pointer">Second Brain</p>
          </div>
          <div className="pt-2">
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType(undefined)} text="My brain" icon={<BrainIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("thoughts")} text="Thoughts" icon={<AcademicIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("twitter")} text="Twitter" icon={<TwitterIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("youtube")} text="YouTube" icon={<YoutubeIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("reddit")} text="Reddit" icon={<RedditIcon />} />
          </div>

          <div className="pr-5 text-xl pl-1 font-semibold"
            onClick={Logout}>
            <Button
              hover={false} size="md"
              text="Logout" bg_color="black"
              fullWidth={true}
              shadow={false}
              startIcon={<UserIcon />}
            />
          </div>
        </>
      )}
    </div>
  );
};
