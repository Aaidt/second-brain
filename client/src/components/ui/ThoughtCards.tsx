import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"

interface ThoughtCardPropTypes {
    title: string,
    thoughts: string,
    id?: string,
    share?: boolean
}

export const ThoughtCards = (ThoughCardProps: ThoughtCardPropTypes) => {

    return <div className={`min-w-72 min-h-96 shadow-lg bg-[#183B4E] rounded-md m-2 font-inter`}>
        <div className="flex justify-between pt-4 p-3 transition-all duration-300 ">
            <Page />
            <div className="flex gap-4">
                {(ThoughCardProps.share === true) ? (<Delete contentId={ThoughCardProps.id} />) : null}
            </div>
        </div>
        <div className="flex justify-center min-h-24 w-full max-w-80 ">
        </div>
    </div >
}



