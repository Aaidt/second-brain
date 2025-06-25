import { ReactElement } from "react";

interface SideBarItemProps {
    icon?: ReactElement,
    text: string,
    onClick: () => void
}

export function SideBarItems(props: SideBarItemProps) {
    return (
        <div onClick={props.onClick} className="pt-2 font-serif cursor-pointer items-center 
        m-3 flex gap-4 rounded-lg font-medium text-lg p-3 hover:bg-black/10 transition-all duration-200 ">
            {props.icon} {props.text}
        </div>
    )
}