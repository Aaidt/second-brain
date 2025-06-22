import { useState, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "./Button"
import { DropDownMenu } from "./dropdown-menu"
import { toast } from "react-toastify"
import axios from "axios";

type modalProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function CreateContentModal({ open, setOpen }: modalProps) {
    const [selectedVal, setSelectedVal] = useState("");
    const titleRef = useRef<HTMLInputElement>(null)
    const linkRef = useRef<HTMLInputElement>(null)
    const type = selectedVal

    const handleRequest = async () => {
        await axios.post(`${BACKEND_URL}/api/v1/second-brain/content`, {
            title: titleRef.current?.value,
            link: linkRef.current?.value,
            type
        }, {
            headers: {
                "Authorization": localStorage.getItem("authorization")
            }
        })
        toast.success("Content added sucessfully!!!");
    }

    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-md w-120 h-80 flex flex-col gap-4 p-5 text-black
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards]">
                    <div className="font-bold font-playfair text-4xl pb-1 pt-2 flex justify-center">Add Content</div>
                    <div className="">
                        <div>
                            <div className="m-2">
                                <input ref={titleRef} 
                                onKeyDown={(e) => {
                                    if(e.key === "Enter"){
                                        linkRef.current?.focus()
                                    }
                                }}
                                type="text" 
                                className="w-full rounded-md p-2 border border-black"
                                    placeholder="Title..." />
                            </div>
                            <div className="m-2">
                                <input ref={linkRef} type="text" className="w-full rounded-md p-2 border border-black"
                                    placeholder="Paste the URL here..." />
                            </div>
                        </div>

                        <div>
                            <div className="pr-3 ">
                                <DropDownMenu
                                    options={[
                                        { label: "YouTube", value: "youtube" },
                                        { label: "X", value: "twitter" },
                                        { label: "Reddit", value: "reddit" },
                                        { label: "Others", value: "others" },
                                    ]}
                                    onSelect={(val) => setSelectedVal(val)}
                                />
                            </div>

                            <div className="font-bold pr-3">
                                <Button hover={false}
                                    shadow={false} size="md"
                                    text="Submit" bg_color="black"
                                    fullWidth={true}
                                    onClick={() => {
                                        handleRequest()
                                        setOpen(!open)
                                    }} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
