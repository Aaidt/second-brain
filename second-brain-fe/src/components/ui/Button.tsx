import { ReactElement } from "react";

interface ButtonProps {
    size: "sm" | "md" | "lg",
    text: string,
    bg_color: "black" | "white" | "green",
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

const fixedStyles = "rounded-md flex duration-300 m-1"

const hoverStyles = "hover:-translate-y-2"

const colorStyles = {
    "black": "bg-black text-white",
    "white": "bg-white hover:underline underline-offset-6",
    "green": "bg-green-400 "
}

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={`${'gap-1'} ${fixedStyles} ${hoverStyles} ${sizeStyles[props.size]} ${props.fullWidth ? 'w-full m-4 flex justify-center' : null} ${colorStyles[props.bg_color]} `}
            onClick={() => props.onClick}
        >
            {props.startIcon} {props.text} {props.endIcon}
        </button>
    )
}