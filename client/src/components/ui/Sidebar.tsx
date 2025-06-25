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
import { MessageCirclePlus, PanelLeftClose, PanelRightClose } from "lucide-react"

interface SidebarTypes {
  type?: string | undefined,
  setType?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function Sidebar(sidebarProps: SidebarTypes) {
  const navigate = useNavigate()
  const { sidebarClose, setSidebarClose, isSharedPage } = useSideBar()

  function Logout() {
    localStorage.removeItem("authorization");
    navigate("/signin");
  }

  return (
    <div
      className={`h-full min-h-screen bg-white border border-black/20 text-black/90 border-black shadow shadow-black/20
         transition-all duration-300 ease-in-out overflow-hidden 
        ${sidebarClose ? "w-15" : "w-65"
        }`}
    >
      <div
        className={`pt-5 pl-3 pb-3 cursor-pointer transition-transform duration-200 ${sidebarClose ? "text-center" : ""
          }`}
        onClick={() => setSidebarClose(!sidebarClose)}
      >
        {sidebarClose ? <PanelRightClose /> : <PanelLeftClose />}
      </div>

      {!sidebarClose && (
        <>
          <div className="flex font-bold font-playfair items-center">
            <p onClick={() => navigate("/")} className="pl-6  text-4xl pt-1 cursor-pointer">Second <br /> Brain</p>
          </div>
          <div className="pt-3">
            <SideBarItems onClick={() => navigate("/chat")} text="Chat" icon={<MessageCirclePlus className="stroke-1" />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType(undefined)}
              text={isSharedPage ? 'Shared Brain' : 'My Brain'} icon={<BrainIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("thoughts")} text="Thoughts" icon={<AcademicIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("twitter")} text="Twitter" icon={<TwitterIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("youtube")} text="YouTube" icon={<YoutubeIcon />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("reddit")} text="Reddit" icon={<RedditIcon />} />
          </div>

          {isSharedPage ? null :
            <div className="pr-5 text-xl pl-1 font-semibold"
              onClick={Logout}>
              <Button
                hover={false} size="md"
                text="Logout" bg_color="black"
                fullWidth={true}
                shadow={false}
                startIcon={<UserIcon />}
              />
            </div>}
        </>
      )}
    </div>
  );
};
