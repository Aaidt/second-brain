import { useState } from "react";
import { Button } from "./Button"
import { DropDownMenu } from "./dropdown-menu"

type modalProps = {
    open: Boolean
}

export const CreateContentModal = ({open}: modalProps) => {
    const [selectedVal, setSelectedVal] = useState("");

    return (open &&
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/70 ">
        <div className="flex justify-center items-center h-screen pb-10">
            <div className="bg-[#183B4E] rounded-md min-w-90 h-96 p-5 text-[#DDA853]">
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
                        <Button size="md" text="Submit" bg_color="gold" fullWidth={true} />
                    </div>

                </div>
            </div>
        </div>
    </div>
    )
}