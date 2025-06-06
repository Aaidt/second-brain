import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"

interface cardPropTypes {
    title: string,
    type: 'youtube' | 'twitter' | 'reddit' | 'others',
    link: string,
    id?: string,
    share?: boolean
}

export const CardComponent = (cardProps: cardPropTypes) => {

    const getYTEmbedLink = (url: string) => {
        try {
            const parsed = new URL(url);
            const videoId = parsed.searchParams.get('v');
            if (!videoId) return null;

            return `https://www.youtube.com/embed/${videoId}`
        } catch (err) {
            console.log(err);
        }
    }


    return <div className={`${cardProps.type === "youtube" ? 'max-h-125' : 'undefined'} min-w-72 min-h-96 shadow-lg bg-[#2C3930] text-white/90 rounded-md m-2 font-playfair`}>
        <div className="flex justify-between pt-4 p-3 transition-all duration-300 ">
            <Page />
            <div className="flex gap-4">
                {(cardProps.share === true) ? (<Delete contentId={cardProps.id} />): null }
                <ShareIcon style="zoom" onClick={() => {
                    console.log("handleShare called.")
                    alert("Share using this link:⚡" + cardProps.link)
                }} />
            </div>
        </div>
        <div className="flex justify-center min-h-24 w-full max-w-80 ">
            {cardProps.type === "youtube" && (() => {
                const embedUrl = getYTEmbedLink(cardProps.link);
                if (!embedUrl) return <p>Invalid YouTube link</p>;

                return (
                    <div className="">
                        <div className="flex justify-center items-center">
                            <h1 className="text-xl px-4 font-bold p-2">{cardProps.title}</h1>
                        </div>
                        <div className="flex justify-center">
                            <iframe
                                width="250"
                                height="300"
                                src={embedUrl}
                                title={cardProps.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                className="rounded-md m-4"
                                allowFullScreen
                            />
                        </div>
                    </div>
                );
            })()}

            {cardProps.type == "twitter" &&
                <div className="pb-2">
                    <h1 className="flex justify-center text-xl p-1 font-bold">{cardProps.title}</h1>
                    <blockquote className="twitter-tweet bg-[#F5EEDC]">
                        <a href={cardProps.link.replace("x.com", "twitter.com")} />
                    </blockquote>
                </div>
            }
            {cardProps.type == "reddit" &&
                <div className="m-2 p-1">
                    <h1 className="flex justify-center p-1 font-bold text-xl">{cardProps.title}</h1>
                    <blockquote className="reddit-embed-bq" data-embed-height="316">
                        <a href={cardProps.link}>View this post on Reddit.</a>
                    </blockquote>
                </div>
            }

        </div>
    </div >
}



