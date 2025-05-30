import { useState, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "./Button"
import { DropDownMenu } from "./dropdown-menu"
import axios from "axios";

type modalProps = {
    open: Boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const CreateContentModal = ({ open, setOpen }: modalProps) => {
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
        alert("Content added sucessfully!!!");
    }

    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 z-50 flex justify-center items-center">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-[#4B3F2F] rounded-md w-120 h-80 flex flex-col gap-4 p-5 text-[#D2B48C]
                    opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards]">
                    <div className="font-bold font-playfair text-4xl pb-1 pt-2 flex justify-center">Add Content</div>
                    <div className="">
                        <div>
                            <div className="m-2">
                                <input ref={titleRef} type="text" className="w-full rounded-md p-2 border"
                                    placeholder="Title..." />
                            </div>
                            <div className="m-2">
                                <input ref={linkRef} type="text" className="w-full rounded-md p-2 border"
                                    placeholder="Link..." />
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
                                <Button hover={true} shadow={false} size="md" text="Submit" bg_color="white" fullWidth={true} onClick={() => {
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
