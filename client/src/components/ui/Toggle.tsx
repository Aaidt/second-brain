import React from "react";


export const Toggle: React.FC = () => {

    const handleToggle = () => {
        document.documentElement.classList.toggle("dark");
    }

    return (
        <>
            <button
                onClick={() => {
                    { handleToggle() }
                }}
                className="rounded-xl bg-blue-500 text-white hover:bg-blue-700 px-4 py-2"
            >Toggle</button>
        </>
    )

}