import { SideBarItems } from "./SideBarItems";
import { useSideBar } from "../../hooks/sidebarContext"
import { Button } from "./Button"
import { useNavigate } from "react-router-dom"
import { UserIcon } from "../icons/UserIcon"
import { IoLogoReddit } from "react-icons/io5";
import { MessageCircle, PanelLeftClose, PanelRightClose, Brain, Youtube, Twitter, BookOpen } from "lucide-react"
import { logout } from "@/auth";

interface SidebarTypes {
  type?: string | undefined,
  setType?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function Sidebar(sidebarProps: SidebarTypes) {
  const navigate = useNavigate()
  const { sidebarClose, setSidebarClose, isSharedPage } = useSideBar()

  const BACKEND_URL = import.meta.env.BACKEND_URL

  function Logout() {
    logout(BACKEND_URL)
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
            <p onClick={() => navigate("/")} className="pl-6 font-medium text-4xl pt-2 cursor-pointer">Second <br /> Brain</p>
          </div>
          <div className="pt-3">
            <SideBarItems onClick={() => navigate("/chat")} text="Chat" icon={<MessageCircle className="stroke-[1.5] size-6" />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType(undefined)}
              text={isSharedPage ? 'Shared Brain' : 'My Brain'} icon={<Brain className="stroke-[1.5] size-6" />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("thoughts")}
              text="Thoughts" icon={<BookOpen className="stroke-[1.5] size-6" />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("twitter")}
              text="Twitter" icon={<Twitter className="stroke-[1.5] size-6" />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("youtube")}
              text="YouTube" icon={<Youtube className="stroke-[1.5] size-6" />} />
            <SideBarItems onClick={() => sidebarProps.setType && sidebarProps.setType("reddit")}
              text="Reddit" icon={<IoLogoReddit className="stroke-[1.5] size-7" />} />
          </div>

          {isSharedPage ? null :
            <div className="pr-5 text-xl pl-1 pt-3 "
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
