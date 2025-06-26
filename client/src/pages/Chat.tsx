import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendHorizontal, Brain, ChevronDown, PanelLeftClose, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown'


type Message = {
    sender: "user" | "ai";
    content: string;
};

interface axiosResponse {
    answers: string,
    references: { title: string; thoughts: string }[]
}

export function Chat() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [references, setReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [isClosed, setIsClosed] = useState<boolean>(false)
    const [savedChats, setSavedChats] = useState<Message[]>([])
    const [showChat, setShowChat] = useState<boolean>(false)


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        async function fetchSavedChats() {
            try {
                const fetchedChats = await axios.get<{ chats: Message[] }>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/second-brain/chats`, {
                    headers: {
                        Authorization: localStorage.getItem("authorization")
                    }
                })
                setSavedChats(fetchedChats.data.chats)
            } catch (err) {
                toast.error("Error fetching chats");
            }
        }
        fetchSavedChats()
    }, [])

    async function saveChat(message: Message) {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/second-brain/chats`, {
                sender: message.sender,
                content: message.content
            }, {
                headers: {
                    Authorization: localStorage.getItem("authorization")
                }
            });
            // setSavedChats((prev) => [...prev, message]);
        } catch (err) {
            console.log(err)
        }

    }

    async function handleChatQuery() {
        if (!query.trim()) return;

        const userMessage: Message = { sender: 'user', content: query }
        setMessages(prev => [...prev, { sender: "user", content: query }]);
        setLoading(true);

        try {
            await saveChat(userMessage)
            const res = await axios.post<axiosResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/second-brain/chat-query`, {
                query
            }, {
                headers: {
                    Authorization: localStorage.getItem("authorization")
                }
            });

            const aiResponse = res.data?.answers || "No answer";
            setReferences(res.data?.references || []);

            const aiMessage: Message = { sender: 'ai', content: aiResponse }
            setMessages(prev => [...prev, { sender: "ai", content: aiResponse }]);

            await saveChat(aiMessage)
        } catch (err) {
            toast.error("Error fetching response");
        }

        setQuery('');
        setLoading(false);
    };

    return (
        <div className="h-screen w-screen grid grid-cols-[340px_1fr] overflow-hidden">
            <div className={`bg-white border-r border-black/30 overflow-y-auto p-4 duration-300 overflow-hidden transition-all
                    ${isClosed ? 'w-15' : 'w-85'}
                `}>
                {isClosed ? <PanelRightClose
                    className="cursor-pointer"
                    onClick={() => setIsClosed(false)} /> :
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between">
                            <div
                                className="mb-6  flex gap-1 items-center"
                                onClick={() => navigate("/dashboard")}>
                                <Brain
                                    className="size-5 cursor-pointer stroke-[1.5]"
                                />
                                <p className="font-medium text-xl cursor-pointer">Second Brain</p>
                            </div>

                            <PanelLeftClose
                                className="cursor-pointer stroke-[1.5]"
                                onClick={() => setIsClosed(true)} />
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-800">Sources from your thoughts:</h3>
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }} className="space-y-4 pr-2">
                            {references.map((ref, idx) => (

                                <div key={idx} className="bg-gray-100 border text-black rounded-md p-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <h3 className="mb-1 text-sm font-medium">{ref.title}</h3>
                                        <ChevronDown onClick={() => {
                                            setOpenIndex(openIndex === idx ? null : idx)
                                        }} className="size-5 stroke-[1.5]" />
                                    </div>
                                    {openIndex === idx &&
                                        <motion.div
                                            initial={{ opacity: 0, y: -40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {ref.thoughts}
                                        </motion.div>}
                                </div>
                            ))}
                        </motion.div>

                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold mb-2 text-gray-800 pt-8">Previous chats:</h3>
                            <ChevronDown onClick={() => {
                                setShowChat(!showChat)
                            }} className="size-5 stroke-[1.5] mt-7" />
                        </div>
                        {showChat ?
                            (savedChats.map((chat, i) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4 }}
                                    key={i}
                                    className={`
                                rounded-lg p-1 whitespace-pre-wrap my-1 
                                ${chat.sender === "user"
                                            ? "text-md text-black ml-auto font-medium max-w-sm"
                                            : "text-black mr-auto  max-w-2xl text-sm"
                                        }
                            `}
                                >
                                    <ReactMarkdown>{`${chat.sender === "ai" ? 'Ans: ' + chat.content
                                        : 'Q. ' + chat.content} `}
                                    </ReactMarkdown>
                                </motion.div>
                            ))) : null}
                    </motion.div>
                }
            </div>

            <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex-1  px-6 py-4 space-y-4 bg-white">

                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            key={i}
                            className={`
                                rounded-lg p-4 whitespace-pre-wrap border text-white
                                ${msg.sender === "user"
                                    ? "bg-black/87 ml-auto border-r-6 border-r-green-600 max-w-sm"
                                    : "bg-black/87 mr-auto border-l-6 border-l-red-700  max-w-2xl"
                                }
                            `}
                        >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className='bg-white p-3 sticky bottom-0'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }} >
                        <div className="flex gap-2 max-w-4xl">
                            <div className="w-full flex items-center">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleChatQuery()}
                                    className="flex-1 px-4 py-2 border-2 w-full border-gray-400 rounded-md text-base"
                                    placeholder="How can I help today..."
                                    disabled={loading}
                                />
                            </div>
                            <div className="-translate-y-1">
                                <Button
                                    size="md"
                                    bg_color="black"
                                    fullWidth={false}
                                    onClick={handleChatQuery}
                                    loading={loading}
                                    text={<SendHorizontal size={18} />}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div >
    );
}
