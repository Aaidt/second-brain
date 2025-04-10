import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"

interface cardPropTypes {
    title: string,
    type: 'youtube' | 'twitter' | 'reddit' | 'others',
    link: string
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

    return <div className="min-w-72 min-h-96 shadow-lg bg-[#183B4E] rounded-md m-2">
        <div className="flex justify-between p-5 transition-all duration-800">
            <Page />
            <div className="flex gap-4">
                <Delete />
                <ShareIcon style="zoom" />
            </div>
        </div>
        <div className="flex justify-center min-h-24 w-full">
            {cardProps.type === "youtube" && (() => {
                const embedUrl = getYTEmbedLink(cardProps.link);
                if (!embedUrl) return <p>Invalid YouTube link</p>;

                return (
                    <div>
                    <h1 className="flex justify-center p-2 font-bold">{cardProps.title}</h1>
                    <iframe
                        width="250"
                        height="200"
                        src={embedUrl}
                        title={cardProps.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                    </div>
                );
            })()}

            {cardProps.type == "twitter" &&
                <div className="pb-2">
                    <h1 className="flex justify-center p-2 font-bold">{cardProps.title}</h1>
                    <blockquote className="twitter-tweet bg-[#F5EEDC]">
                        <a href={cardProps.link.replace("x.com", "twitter.com")} />
                    </blockquote>
                </div>
            }
            {cardProps.type == "reddit" &&
            <div className="m-2 p-1">
                <h1 className="flex justify-center p-2 font-bold">{cardProps.title}</h1>
                <blockquote className="reddit-embed-bq" data-embed-height="316">
                    <a href={cardProps.link}>View this post on Reddit.</a>
                </blockquote>
            </div>
            }

        </div>
    </div >
}



