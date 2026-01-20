import { Delete } from "../icons/Delete"
import { Share,FileText } from "lucide-react"
import { toast } from 'react-toastify'
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { RedditIcon } from "../icons/RedditIcon"
// import { Notebook } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import { ContextModal } from "./ContextModal"

interface cardPropTypes {
    title: string,
    type: 'youtube' | 'twitter' | 'reddit' | 'others',
    link: string,
    id?: string,
    share?: boolean,
    isSharedPage: boolean,
    created_at: Date 
}

export function CardComponent(cardProps: cardPropTypes) {

    const getYTEmbedLink = (url: string) => {
        try {
            const parsed = new URL(url);
            const videoId = parsed.searchParams.get('v');
            if (!videoId) return null;

            return `https://www.youtube.com/embed/${videoId}`
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div>
            {/* <ContextModal setOpen={setOpen}/> */}
            <div className={`${cardProps.type === "youtube" ? 'max-h-100' : 'undefined'} max-w-80 min-h-96
                bg-[#111] text-gray-300 rounded-2xl mx-2 mt-6 border border-white/10 shadow-xl font-playfair hover:border-teal-500/30 transition-colors`}>

                <div className="flex justify-between pt-4 p-3 items-center transition-all duration-300 ">

                    <div className="flex justify-center items-center gap-2">

                        {cardProps.type === "youtube" ? (
                            <div className="relative">
                                <YoutubeIcon onClick={() => {
                                    window.open(cardProps.link, "_blank");
                                }} className="w-7 h-7 hover:scale-105 duration-200 transition-all cursor-pointer" /> </div>)

                            : cardProps.type === "twitter" ? (
                                <div className="relative">
                                    <TwitterIcon onClick={() => {
                                        window.open(cardProps.link, "_blank");
                                    }} className="w-7 h-7 hover:scale-105 duration-200 transition-all cursor-pointer" /> </div>)

                                : cardProps.type === "reddit" ? (
                                    <div className="relative">
                                        <RedditIcon onClick={() => {
                                            window.open(cardProps.link, "_blank");
                                        }} className="w-7 h-7 hover:scale-105 duration-200 transition-all cursor-pointer" /> </div>)

                                    : cardProps.type === "others" ? (
                                        <div
                                            className="relative"
                                        >
                                            <FileText /> </div>) : null
                        }
                        {/* <Notebook onClick={() => {
                            setOpen(!open)
                        }}
                            strokeWidth="1.5"
                            className="hover:scale-105 duration-200 transitiona-all" /> */}
                    </div>
                    <div className="flex gap-4">
                        {(cardProps.isSharedPage === false) ? (
                            <div className="relative"
                            >
                                <Delete contentId={cardProps.id} /> </div>) : null}

                        <div className="relative">
                            <Share className="size-5 cursor-pointer" strokeWidth="1.5" onClick={() => {
                                console.log("handleShare called.")
                                toast.success("Share using this link:⚡" + cardProps.link)
                            }} /> </div>
                    </div>
                </div>
                <div className="flex justify-center min-h-24 w-full max-w-80 ">
                    {cardProps.type === "youtube" && (() => {
                        const embedUrl = getYTEmbedLink(cardProps.link);
                        if (!embedUrl) return <p>Invalid YouTube link</p>;

                        return (
                            <div className="">
                                <div className="flex justify-center items-center">
                                    <h1 className="text-2xl font-medium font-playfair">{cardProps.title}</h1>
                                </div>
                                <div className="flex justify-center">
                                    <iframe
                                        width="260"
                                        height="290"
                                        src={embedUrl}
                                        title={cardProps.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        className="rounded-md mb-4 mt-2 "
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



