import { SideBarItems } from "./SideBarItems";
import { useSideBar } from "../../hooks/sidebarContext"
import { Button } from "./NativeButton"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  async function Logout() {
    await logout(BACKEND_URL)
    navigate("/signin");
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-background/95 border-r border-foreground/20 text-foreground/90 
        transition-transform duration-300 ease-in-out z-50
        ${sidebarClose ? "-translate-x-full" : "translate-x-0 w-15"}
      `}
    >
      <div
        className={`pt-5 pl-3 pb-3 cursor-pointer transition-transform duration-200 ${sidebarClose ? "text-center" : ""
          }`}
        onClick={() => setSidebarClose(!sidebarClose)}
      >
        {sidebarClose ? <PanelRightClose className="stroke-[1.5]" /> : <PanelLeftClose className="stroke-[1.5]" />}
      </div>

      {!sidebarClose && (
        <>
          <div className="flex font-playfair items-center">
            <p onClick={() => navigate("/")} className="pl-6 font-medium text-4xl pt-2 cursor-pointer">Second <br /> Brain</p>
          </div>
          <div className="pt-3">
            <SideBarItems 
              onClick={() => navigate("/chat")} 
              text="Chat" 
              icon={<MessageCircle className="size-5" strokeWidth="1.5" />} />

            <SideBarItems 
              onClick={() => sidebarProps.setType && sidebarProps.setType(undefined)}
              text={isSharedPage ? 'Shared Brain' : 'My Brain'} 
              icon={<Brain className="size-5" strokeWidth="1.5" />} />

            <SideBarItems 
              onClick={() => sidebarProps.setType && sidebarProps.setType("thoughts")}
              text="Thoughts" 
              icon={<BookOpen className="size-5" strokeWidth="1.5" />} />

            <SideBarItems 
              onClick={() => sidebarProps.setType && sidebarProps.setType("twitter")}
              text="Twitter" 
              icon={<Twitter className="size-5" strokeWidth="1.5" />} />

            <SideBarItems 
              onClick={() => sidebarProps.setType && sidebarProps.setType("youtube")}
              text="YouTube" 
              icon={<Youtube className="size-5" strokeWidth="1.5" />} />

            <SideBarItems 
              onClick={() => sidebarProps.setType && sidebarProps.setType("reddit")}
              text="Reddit" 
              icon={<IoLogoReddit className="size-6" strokeWidth="1.5" />} />
              
          </div>

          {isSharedPage ? null :
            <div className="pr-5 pl-1 pt-3 "
              onClick={Logout}>
              <Button
                hover={false} size="md"
                text="Logout" bg_color="defaultTheme"
                fullWidth={true}
                shadow={false}
                startIcon={<User size="20" className="mr-2" strokeWidth="1.5" />}
              />
            </div>}
        </>
      )}
    </div>
  );
};
