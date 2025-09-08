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
            className="flex items-center gap-4 cursor-pointer 
                   m-2 px-4 py-3 rounded-xl font-medium text-md
                   hover:bg-foreground/10 hover:backdrop-blur-sm
                   transition-all duration-200 ease-in-out"
        >
            <div className="text-foreground/80">{props.icon}</div>
            <span className="text-foreground">{props.text}</span>
        </div>
    )
}
