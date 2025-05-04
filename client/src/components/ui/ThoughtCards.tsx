import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"

interface ThoughtCardPropTypes {
    title: string,
    thoughts: string,
    id?: string,
    share?: boolean
}

export const ThoughtCards = (ThoughCardProps: ThoughtCardPropTypes) => {
    const sentences = ThoughCardProps.thoughts.split(/[.!?]+/).slice(0, 3).join('. ') + '.';

    return <div className={`min-w-72 min-h-96 shadow-lg bg-[#5F4B36] rounded-md m-2 font-playfair`}>
        <div className="flex justify-between pt-4 p-3 transition-all duration-300 ">
            <Page />
            <div className="flex gap-4">
                {(ThoughCardProps.share === true) ? (<Delete ThoughtId={ThoughCardProps.id} />) : null}
            </div>
        </div>
        <div className="flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4">{ThoughCardProps.title}</h1>
            <div className="relative">
                <p className="line-clamp-10 font-roboto">{sentences}</p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#5F4B36] to-transparent"></div>
            </div>
        </div>
    </div >
}



