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
                <ShareIcon />
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
                {/* <p lang="zxx" dir="ltr">
                    <a href="https://t.co/ZXngsiEYP2">
                        pic.twitter.com/ZXngsiEYP2
                    </a>
                </p>&mdash; Observer (@Observer_ofyou)
                <a href={cardProps.link}>
                    April 7, 2025
                </a> */}
                <a href="https://x.com/Observer_ofyou/status/1909211398002950349" />
            </blockquote>}

        </div>
    </div>
}
