import { SideBarItems } from "./SideBarItems";
import { useSideBar } from "../../hooks/sidebarContext"
import { Button } from "./NativeButton"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import { IoLogoReddit } from "react-icons/io5";
import { MessageCircle, PanelLeftClose, PanelRightClose, Brain, Youtube, Twitter, BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabase";

interface SidebarTypes {
    type?: string | undefined,
    setType?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function Sidebar(sidebarProps: SidebarTypes) {
    const navigate = useNavigate()
    const { sidebarClose, setSidebarClose, isSharedPage } = useSideBar()

    async function Logout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <div
            className={`h-full min-h-screen bg-black/20 backdrop-blur-xl border border-white/10 text-gray-300
        transition-all duration-200 ease-in-out overflow-hidden z-20
        ${sidebarClose ? "w-15" : "w-64"
                }`}
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
                            text="My Brain"
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
                        <div className="pr-5 pl-1 pt-5"
                            onClick={Logout}>
                            <Button
                                hover={false} size="lg"
                                text="Logout" bg_color="defaultTheme"
                                fullWidth={true}
                                shadow={false}
                                startIcon={<User size="20" className="mr-2" strokeWidth="2.1" />}
                            />
                        </div>}
                </>
            )}
        </div>
    );
};
