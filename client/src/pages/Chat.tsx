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
    references: { payload: string }[]
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
        <div className="flex flex-col h-screen w-screen bg-[#f7f7f8]">

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`max-w-xl mx-auto px-4 py-3 rounded-md whitespace-pre-wrap 
                        ${msg.sender === "user" ? "bg-white self-end border border-gray-300"
                            : "bg-gray-200/70 self-start"
                        }`}>
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {references.length > 0 && (
                <div className="fixed top-0 left-0 max-w-1/4 bg-white border-r border-gray-300 p-4">
                    <h3 className="font-semibold mb-2 text-gray-700">Sources from your thoughts:</h3>
                    <div className="space-y-2">
                        {references.map((ref, idx) => (
                            <div key={idx} className="bg-gray-50 border rounded p-3">
                                <strong>{ref.title}</strong>
                                <p className="text-sm text-gray-700">{ref.thoughts}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full z-50 border-t border-gray-300 bg-white p-4 sticky bottom-0">
                <div className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleChatQuery()}
                        className="flex-1 px-4 py-2 border border-gray-400/70 rounded-md text-base"
                        placeholder="Ask your second brain anything..."
                        disabled={loading}
                    />
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
    );
}
