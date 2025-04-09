import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"

interface cardPropTypes {
    title: string,
    type: string,
    link: string
}


export const CardComponent = (cardProps: cardPropTypes) => {
    return <div className="w-72 h-96 bg-[#183B4E] rounded-md ">
        <div className="flex justify-between p-5 transition-all duration-800">
            <Page />
            <div className="flex gap-4">
                <Delete />
                <ShareIcon style="zoom" />
            </div>
        </div>
        <div className="flex justify-center">
            {cardProps.type == "youtube" && <iframe
                width="250"
                height="200"
                src={cardProps.link.replace("watch", "embed")}
                title={cardProps.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
            </iframe>}

            {cardProps.type == "twitter" && <blockquote className="twitter-tweet">
                <a href={cardProps.link} />
            </blockquote>}

        </div>
    </div>
}
