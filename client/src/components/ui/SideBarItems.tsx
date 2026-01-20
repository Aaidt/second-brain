import { ReactElement } from "react";

interface SideBarItemProps {
    icon?: ReactElement,
    text: string,
    onClick: () => void
}

export function SideBarItems(props: SideBarItemProps) {
    return (
        <div
            onClick={props.onClick}
            className="flex items-center gap-4 cursor-pointer group
                   m-2 px-4 py-3 rounded-xl font-medium text-md
                   hover:bg-teal-500/10 hover:backdrop-blur-sm
                   transition-all duration-200 ease-in-out"
        >
            <div className="text-gray-400 group-hover:text-teal-400 transition-colors">{props.icon}</div>
            <span className="text-gray-400 group-hover:text-teal-100 transition-colors">{props.text}</span>
        </div>
    )
}
