import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"

interface cardPropTypes {
    title: string,
    type: 'youtube' | 'twitter' | 'reddit' | 'others',
    link: string
}


export const CardComponent = (cardProps: cardPropTypes) => {
    return <div className="min-w-72 min-h-96 shadow-lg bg-[#183B4E] rounded-md ">
        <div className="flex justify-between p-5 transition-all duration-800">
            <Page />
            <div className="flex gap-4">
                <Delete />
                <ShareIcon style="zoom" />
            </div>
        </div>
        <div className="flex justify-center min-h-24 w-full">
            {cardProps.type == "youtube" && <iframe
                width="250"
                height="200"
                src={cardProps.link.replace("watch", "embed")}
                title='YouTube video player'
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
            </iframe>}

            {cardProps.type == "twitter" &&
                <div className="pb-2">
                    <blockquote className="twitter-tweet bg-[#F5EEDC]">
                        <a href={cardProps.link.replace("x.com", "twitter.com")} />
                    </blockquote>
                </div>
            }
        </div>
    </div>
}

