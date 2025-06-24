import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

type Message = {
    sender: "user" | "ai";
    content: string;
};

interface axiosResponse {
    answers: string,
    references: { title: string; thoughts: string }[]
}

export function Chat() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [references, setReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            <div className="bg-white border-r border-gray-300 overflow-y-auto p-4">
                <h3 className="font-semibold mb-2 text-gray-700">Sources from your thoughts:</h3>
                <div className="space-y-4 pr-2">
                    {references.map((ref, idx) => (
                        <div key={idx} className="bg-gray-50 border rounded-md p-3 shadow-sm">
                            <strong className="block mb-1">{ref.title}</strong>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ref.thoughts}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex-1  px-6 py-4 space-y-4 bg-[#f7f7f8]">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`
                                rounded-lg p-4 whitespace-pre-wrap shadow-sm border
                                ${msg.sender === "user"
                                    ? "bg-white ml-auto border-gray-300 max-w-sm"
                                    : "bg-gray-200 mr-auto border-gray-300 max-w-2xl"
                                }
                            `}
                        >
                            {msg.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-300 bg-white p-3 sticky bottom-0">
                    <div className="flex gap-2 max-w-4xl mx-auto">
                        <div className="w-full flex items-center">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleChatQuery()}
                                className="flex-1 px-4 py-2 border w-full border-gray-400/70 rounded-md text-base"
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
                </div>
            </div>
        </div>
    );
}
