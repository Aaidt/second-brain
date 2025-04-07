import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"


export const CardComponent = () => {
    return <div className="w-72 h-96 bg-[#183B4E] rounded-md ">
        <div className="flex justify-between p-5">
            <Page />
            <div className="flex gap-4">
                <Delete />
                <ShareIcon />
            </div>
        </div>
    </div>
}