import { ReactElement } from "react";

interface SideBarItemProps {
    icon: ReactElement,
    text: string
}

export const SideBarItems = (props: SideBarItemProps) => {
    return (
        <div className="m-3 flex justify-between rounded-lg font-bold text-xl p-4 hover:bg-purple-600 transition-all duration-200 hover:-translate-y-1 hover:text-purple-400">
            {props.icon} {props.text}
        </div>
    )
}