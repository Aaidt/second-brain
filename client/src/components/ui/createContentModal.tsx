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
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 ">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-[#183B4E] rounded-md min-w-90 h-76 p-5 text-[#DDA853]">
                    <div className="font-bold font-playfair text-4xl pb-3 flex justify-center">Add Content</div>
                    <div className="">
                        <div className="m-2">
                            <input ref={titleRef} type="text" className="w-full rounded-md p-2 border"
                                placeholder="Title..." />
                        </div>
                        <div className="m-2">
                            <input ref={linkRef} type="text" className="w-full rounded-md p-2 border"
                                placeholder="Link..." />
                        </div>

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
                            <Button shadow={false} size="md" text="Submit" bg_color="gold" fullWidth={true} onClick={() => {
                                handleRequest()
                                setOpen(!open)
                            }} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}