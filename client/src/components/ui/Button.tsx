import { ReactElement } from "react";

interface ButtonProps {
    size: "sm" | "md" | "lg",
    text: string,
    bg_color: "black" | "white" | "blue" | "gold",
    startIcon?: ReactElement,
    endIcon?: ReactElement,
    fullWidth: boolean,
    onClick?: () => void
}

const sizeStyles = {
    "sm": "px-4 py-2",
    "md": "px-4 py-2",
    "lg": "px-4 py-2"
}

const fixedStyles = "rounded-md duration-200 m-2 mt-6 mr-1 flex"

const hoverStyles = "hover:-translate-y-1"

const colorStyles = {
    "black": "bg-gray-700 text-white",
    "white": "bg-[#F5EEDC] hover:underline underline-offset-6",
    "blue": "bg-[#183B4E]",
    "gold": "bg-[#DDA853] text-[#183B4E]"
}

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={`${'gap-1'} ${fixedStyles} ${hoverStyles} ${sizeStyles[props.size]} ${props.fullWidth ? 'w-full flex justify-center' : null} ${colorStyles[props.bg_color]} `}
            onClick={props.onClick}
        >
            {props.startIcon} {props.text} {props.endIcon}
        </button>
    )
}