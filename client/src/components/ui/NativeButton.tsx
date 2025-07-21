import { ReactElement } from "react";

interface ButtonProps {
    size: "sm" | "md" | "lg",
    text: string | React.ReactNode,
    bg_color: "black" | "white" | "blue" | "gold" | "brown" | "dirt" | "gray" | "pale" | "purple" | "pink" | "defaultTheme" | "defaultText",
    startIcon?: ReactElement,
    endIcon?: ReactElement,
    fullWidth: boolean,
    onClick?: () => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void,
    shadow?: boolean,
    hover?: boolean,
    loading?: boolean
}

const sizeStyles = {
    "sm": "px-4 py-2",
    "md": "px-4 py-2",
    "lg": "px-4 py-2"
}

const fixedStyles = "rounded-sm duration-200 m-2 mt-4 flex items-center cursor-pointer"

const colorStyles = {
    "black": "bg-black/85 hover:bg-black/80 text-white transition-all duration-200",
    "white": "bg-white hover:bg-white/80 text-black/95  transition-all duration-200 ",
    "blue": "bg-[#183B4E] text-[#F5EEDC] transition-all duration-200",
    "gold": "bg-[#DDA853] text-black/60 transition-all duration-200",
    "brown": "bg-[#4B3F2F] transition-all duration-200 text-white hover:shadow-black/50 hover:shadow-md",
    "dirt": "bg-[#A0522D] transition-all duration-200 text-white/80 hover:shadow-md hover:shadow-black/50",
    "gray": "bg-[#2C2C2C]",
    "pale": "bg-[#DDA853]/0 hover:underline-offset-6 hover:underline transition-all duration-200",
    "purple": "bg-purple-700 hover:bg-purple-600 text-white transition-all duration-200",
    "pink": "bg-[#7743DB] hover:bg-[#7743DB]/80 transition-all duration-200 text-white",
    "defaultTheme": "bg-foreground text-background",
    "defaultText": "bg-background text-foreground hover:underline-offset-6 hover:underline transition-all duration-200"
}

export function Button (props: ButtonProps) {
    return (
        <button
            className={`${'gap-1'} ${fixedStyles} ${props.hover ? 'hover:-translate-y-1' : null} ${sizeStyles[props.size]} ${props.shadow ? 'shadow-md shadow-gray-300 hover:shadow-gray-400' : null} ${props.fullWidth ? 'w-full flex justify-center' : null} ${colorStyles[props.bg_color]} `}
            onClick={props.onClick} onKeyDown={props.onKeyDown} disabled={props.loading}
        >
            {props.startIcon} {props.loading ? 'Processing...' : props.text} {props.endIcon}
        </button>
    )
}
