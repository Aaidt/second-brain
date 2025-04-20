import { ReactElement } from "react";

interface SideBarItemProps {
    icon?: ReactElement,
    text: string
}

export const SideBarItems = (props: SideBarItemProps) => {
    return (
        <div className="pt-3 font-playfair items-center m-3 flex justify-between rounded-lg font-bold text-xl p-3 hover:bg-[#27548A] transition-all duration-200 hover:-translate-y-1">
            {props.icon} {props.text}
        </div>
    )
}