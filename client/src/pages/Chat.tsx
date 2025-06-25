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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChatQuery = async () => {
        if (!query.trim()) return;

        setMessages(prev => [...prev, { sender: "user", content: query }]);
        setLoading(true);

        try {
            const res = await axios.post<axiosResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/second-brain/chat-query`, {
                query
            }, {
                headers: {
                    Authorization: localStorage.getItem("authorization")
                }
            });

            const aiResponse = res.data?.answers || "No answer";
            setReferences(res.data?.references || []);

            setMessages(prev => [...prev, { sender: "ai", content: aiResponse }]);
        } catch (err) {
            toast.error("Error fetching response");
        }

        setQuery('');
        setLoading(false);
    };

    return (
        <div className="h-screen w-screen grid grid-cols-[320px_1fr] overflow-hidden">
            <div className={`bg-white border-r border-black/30 overflow-y-auto p-4 duration-200 transition-all
                    ${isClosed ? 'w-15' : 'w-75'}
                `}>
                {isClosed ? <PanelRightClose
                    className="hover:translate-x-1 duration-200 transition-all cursor-pointer"
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
                                    className="size-5 cursor-pointer"
                                />
                                <p className="font-medium text-xl cursor-pointer">Second Brain</p>
                            </div>

                            <PanelLeftClose
                                className="hover:-translate-x-1 duration-200 transition-all cursor-pointer"
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
                                        <h3 className="block mb-1 font-medium">{ref.title}</h3>
                                        <ChevronDown onClick={() => {
                                            setOpenIndex(openIndex === idx ? null : idx)
                                        }} className="size-5" />
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
                                    ? "bg-black/80 ml-auto border-r-6 border-r-green-600 max-w-sm"
                                    : "bg-black/80 mr-auto border-l-6 border-l-red-800  max-w-2xl"
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
                                    placeholder="Ask your second brain anything..."
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
