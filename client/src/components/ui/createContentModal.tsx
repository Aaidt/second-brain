import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "./Button"
import { DropDownMenu } from "./dropdown-menu"

type modalProps = {
    open: Boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export const CreateContentModal = ({ open, setOpen }: modalProps) => {
    const [selectedVal, setSelectedVal] = useState("");

    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 ">
            <div className="flex justify-center items-center h-screen pb-10">
                <div onClick={(e) => e.stopPropagation()} className="bg-[#183B4E] rounded-md min-w-90 h-96 p-5 text-[#DDA853]">
                    <div className="font-bold text-4xl pb-6  flex justify-center">Add Content</div>
                    <div className="p-1">
                        <div className="m-4">
                            <input type="text" className="w-full rounded-md p-2 border"
                                placeholder="Title..." />
                        </div>
                        <div className="m-4">
                            <input type="text" className="w-full rounded-md p-2 border"
                                placeholder="Link..." />
                        </div>

                        <DropDownMenu
                            options={[
                                { label: "YouTube", value: "youtube" },
                                { label: "X", value: "twitter" },
                                { label: "Reddit", value: "reddit" },
                                { label: "Others", value: "others" },
                            ]}
                            onSelect={(val) => setSelectedVal(val)}
                        />

                        <div className="font-bold">
                            <Button size="md" text="Submit" bg_color="gold" fullWidth={true} onClick={() => {
                                setOpen(!open)
                            }} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}