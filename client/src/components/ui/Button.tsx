import { ReactElement } from "react";

interface ButtonProps {
    size: "sm" | "md" | "lg",
    text: string,
    bg_color: "black" | "white" | "blue" | "gold" | "brown" | "dirt" | "gray" | "pale",
    startIcon?: ReactElement,
    endIcon?: ReactElement,
    fullWidth: boolean,
    onClick?: () => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void,
    shadow: boolean,
    hover: boolean
}

const sizeStyles = {
    "sm": "px-4 py-2",
    "md": "px-4 py-2",
    "lg": "px-4 py-2"
}

const fixedStyles = "rounded-md duration-200 m-2 mt-4 mr-1 flex font-serif cursor-pointer"

const colorStyles = {
    "black": "bg-black text-[#DDA853]",
    "white": "bg-[#D2B48C] text-black/80 transition-all duration-400 ",
    "blue": "bg-[#183B4E] text-[#F5EEDC]",
    "gold": "bg-[#DDA853] text-black/60",
    "brown": "bg-[#4B3F2F] text-white hover:shadow-black/50 hover:shadow-md",
    "dirt": "bg-[#A0522D] text-white/80 hover:shadow-md hover:shadow-black/50",
    "gray": "bg-[#2C2C2C]",
    "pale": "bg-[#DDA853]/0 hover:underline-offset-6 hover:underline"
}

export function Button (props: ButtonProps) {
    return (
        <button
            className={`${'gap-1'} ${fixedStyles} ${props.hover ? 'hover:-translate-y-1' : null} ${sizeStyles[props.size]} ${props.shadow ? 'shadow-md shadow-gray-300 hover:shadow-gray-400' : null} ${props.fullWidth ? 'w-full flex justify-center' : null} ${colorStyles[props.bg_color]} `}
            onClick={props.onClick} onKeyDown={props.onKeyDown}
        >
            {props.startIcon} {props.text} {props.endIcon}
        </button>
    )
}
