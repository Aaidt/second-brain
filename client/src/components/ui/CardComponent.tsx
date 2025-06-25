import { Delete } from "../icons/Delete"
import { Page } from "../icons/Page"
import { ShareIcon } from "../icons/ShareIcon"
import { toast } from 'react-toastify'
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { RedditIcon } from "../icons/RedditIcon"
// import { Notebook } from 'lucide-react'
// import { useState } from "react"
// import { useNavigate } from 'react-router-dom'
// import { ContextModal } from "./ContextModal"

interface cardPropTypes {
    title: string,
    type: 'youtube' | 'twitter' | 'reddit' | 'others',
    link: string,
    id?: string,
    share?: boolean,
    isSharedPage: boolean
}

export function CardComponent(cardProps: cardPropTypes) {
    // const [open, setOpen] = useState<boolean>(false)
    // const navigate = useNavigate()

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


    return (
        <div>
            {/* <ContextModal setOpen={setOpen}/> */}
            <div className={`${cardProps.type === "youtube" ? 'max-h-125' : 'undefined'} min-w-72 min-h-96 
    shadow shadow-black/45 bg-white text-black/90 rounded-md m-2 border border-black/30 font-playfair`}>
                <div className="flex justify-between pt-4 p-3 items-center transition-all duration-300 ">
                    <div className="flex justify-center items-center gap-2">
                        {cardProps.type === "youtube" ? <YoutubeIcon onClick={() => {
                            window.open(cardProps.link, "_blank");
                        }} className="w-8 h-8 hover:scale-105 duration-200 transition-all" />
                            : cardProps.type === "twitter" ? <TwitterIcon onClick={() => {
                                window.open(cardProps.link, "_blank");
                            }} className="w-7 h-7 hover:scale-105 duration-200 transition-all" />
                                : cardProps.type === "reddit" ? <RedditIcon onClick={() => {
                                    window.open(cardProps.link, "_blank");
                                }} className="w-8 h-8 hover:scale-105 duration-200 transition-all" />
                                    : cardProps.type === "others" ? <Page /> : null
                        }
                        {/* <Notebook onClick={() => {
                            setOpen(!open)
                        }}
                            strokeWidth="1.5"
                            className="hover:scale-105 duration-200 transitiona-all" /> */}
                    </div>
                    <div className="flex gap-4">
                        {(cardProps.isSharedPage === false) ? (<Delete contentId={cardProps.id} />) : null}
                        <ShareIcon style="zoom" onClick={() => {
                            console.log("handleShare called.")
                            toast.success("Share using this link:⚡" + cardProps.link)
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
                                    <h1 className="text-2xl px-4 font-medium font-playfair p-2">{cardProps.title}</h1>
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
                            <h1 className="flex justify-center text-2xl p-1 font-medium font-playfair">{cardProps.title}</h1>
                            <blockquote className="twitter-tweet bg-[#F5EEDC]">
                                <a href={cardProps.link.replace("x.com", "twitter.com")} />
                            </blockquote>
                        </div>
                    }
                    {cardProps.type == "reddit" &&
                        <div className="m-2 p-1">
                            <h1 className="flex justify-center p-1 font-medium font-playfair text-2xl">{cardProps.title}</h1>
                            <blockquote className="reddit-embed-bq" data-embed-height="316">
                                <a href={cardProps.link}>View this post on Reddit.</a>
                            </blockquote>
                        </div>
                    }

                </div>
            </div >
        </div>
    )
}



