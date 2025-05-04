import { ReactElement } from "react";

interface SideBarItemProps {
    icon?: ReactElement,
    text: string,
    onClick: () => void
}

export const SideBarItems = (props: SideBarItemProps) => {
    return (
        <div onClick={props.onClick} className="pt-2 font-serif cursor-pointer items-center m-3 flex justify-between rounded-lg font-medium text-lg p-3 hover:bg-white/20 transition-all duration-200 hover:-translate-y-1">
            {props.icon} {props.text}
        </div>
    )
}