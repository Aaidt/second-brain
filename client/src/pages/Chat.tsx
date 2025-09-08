import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MoveUp, ChevronDown, Brain, Trash2, SquarePen, RefreshCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { DeleteChat } from "../components/ui/DeleteChat"
import { getAccessToken, refreshAccessToken } from '../auth';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface axiosResponse {
    answers: string;
    references: { title: string; thoughts: string }[];
    title: string;
}

type Message = {
    id?: number,
    sender: "ai" | "user",
    content: string,
    created_at?: Date
}

interface SessionResponse {
    id: string,
    title: string,
    created_at: Date,
    message: Message[]
}

interface titleUpdateResponse {
    message: string
}

export function Chat() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [references, setReferences] = useState<axiosResponse["references"]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [modalOpenId, setModalOpenId] = useState<string | null>(null);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const tokenRef = useRef<string | null>(getAccessToken())

    async function ensureToken() {
        if (!tokenRef.current) {
            tokenRef.current = await refreshAccessToken(BACKEND_URL);
        }
        if (!tokenRef.current) {
            toast.error("Please log in.")
            navigate("/login")
            return;
        }
        return tokenRef.current;
    }

    async function init() {
        const token = await ensureToken()
        toast.info("Fetching sessions...")
        try {
            const fetchedSessions = await axios.get<{ sessions: SessionResponse[] }>(
                `${BACKEND_URL}/second-brain/api/chatSession/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSessions(fetchedSessions.data.sessions || []);
        } catch (err) {
            console.error('Error fetching chats:', err);
            toast.error('Error fetching saved chats');
            setSessions([]);
        }
    }

    useEffect(() => {
        init()
    }, []);


    async function handleNewChat() {
        const token = await ensureToken()
        try {
            const response = await axios.post<{ session: SessionResponse }>(`${BACKEND_URL}/second-brain/api/chatSession/create`,
                { title: `New chat ${(Math.random()).toString().slice(0, 8)}` },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newSession = response.data?.session
            setCurrentSessionId(newSession.id)
            setMessages([])
            setReferences([])
            setQuery('')

            init()
        } catch (err) {
            toast.error('Could not start a new chat.')
            console.error('Could not start a new chat. ' + err)
        }
    }

    async function sendMessage(message: Message, sessionId: string | null) {
        if (!sessionId) return

        const token = await ensureToken()

        try {
            await axios.post(
                `${BACKEND_URL}/second-brain/api/chatMessage/send/${sessionId}`,
                { sender: message.sender, content: message.content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error('Error sending queries:', err);
            toast.error('Failed to send queries');
        }
    }

    async function handleChatQuery() {
        if (!query.trim()) return;
        if (!currentSessionId) {
            toast.error("Start a session before sending a message.");
            return;
        }

        const isFirstUserMessage = messages.filter(m => m.sender === "user").length === 0;

        const userMessage: Message = { sender: 'user', content: query };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            await sendMessage(userMessage, currentSessionId);
            const token = await ensureToken()
            const res = await axios.post<axiosResponse>(`${BACKEND_URL}/second-brain/api/chatMessage/chat-query`,
                { query },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiResponse = res.data?.answers || 'No answer';
            const aiMessage: Message = { sender: 'ai', content: aiResponse };
            setReferences(res.data?.references || []);
            setMessages((prev) => [...prev, aiMessage]);
            await sendMessage(aiMessage, currentSessionId);

            if (isFirstUserMessage && currentSessionId) {
                const newTitle = res.data?.title || "New chat"

                await axios.put<titleUpdateResponse>(`${BACKEND_URL}/second-brain/api/chatSession/update/${currentSessionId}`,
                    { title: newTitle },
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                setSessions((prevSessions) =>
                    prevSessions.map((s) =>
                        s.id === currentSessionId ? { ...s, title: newTitle } : s
                    )
                );
            }


        } catch (err) {
            toast.error('Error fetching response');
            console.error(err)
        }

        setQuery('');
        setLoading(false);
    }

    async function fetchSession(sessionId: string) {
        const token = await ensureToken()

        try {
            setMessages([])
            const response = await axios.get<{ session: SessionResponse }>(`${BACKEND_URL}/second-brain/api/chatSession/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCurrentSessionId(response.data.session.id)
            setMessages(response.data?.session.message)
        } catch (err) {
            toast.error("Could not fetch that session");
            console.error("Error is: " + err);
        }
    }

    return (
        <div className="h-screen w-screen grid grid-cols-[340px_1fr] overflow-hidden">
            <div
                className={`bg-background text-foreground/90 border-r border-foreground/15 overflow-hidden overflow-y-auto p-4 duration-300 transition-all`}
            >
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-between">
                        <div className="mb-6 flex gap-1 items-center" onClick={() => navigate('/dashboard')}>
                            <Brain className="size-6 cursor-pointer stroke-[1.5]" />
                            <p className="font-medium font-playfair text-2xl cursor-pointer">Second Brain</p>
                        </div>
                        <ModeToggle variable="ghost" />
                    </div>
                    <div className='pb-3'>
                        <div className="flex items-center mb-2 text-sm pl-4 py-2 bg-foreground/15 text-foreground/90
                                hover:bg-foreground/10 duration-200 transition-all rounded-md w-full cursor-pointer"
                            onClick={handleNewChat}>
                            <SquarePen size="18" className='mr-2' />
                            New chat
                        </div>
                        {/* 
							<div className="flex items-center mb-2 text-gray-800 py-2 bg-foreground/95 text-background/90 
								hover:bg-foreground/70 rounded-md px-2 cursor-pointer">
								<Search size="18" className='mr-4' />
									Search chats
							</div> */}
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground/90">Thoughts referrenced:</h3>

                    {references.length === 0 ? (
                        <p className="text-foreground/90 text-sm pt-2">No queries sent.</p>
                    ) : (references.map((ref, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 mb-2 pr-2"
                            key={idx}
                        >
                            <div className="bg-background/80 border text-foreground/90 rounded-md p-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="mb-1 text-sm font-medium">{ref.title}</h3>
                                    <ChevronDown
                                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                        className="size-5 stroke-[1.5] cursor-pointer"
                                    />
                                </div>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-foreground/70 whitespace-pre-wrap"
                                    >
                                        {ref.thoughts}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )))}
                    <div className='flex justify-between items-center mx-1 pt-8 mb-2 '>
                        <h3 className="font-semibold text-foreground/95 ">Previous chats:</h3>
                        <RefreshCcw onClick={init} className="stroke-[1.5] size-4 cursor-pointer 
									hover:-rotate-180 hover:text-blue-600 transition-all duration-300" />
                    </div>
                    {sessions.length === 0 ? (
                        <p className="text-foreground/95 text-sm pt-2">No previous chats.</p>
                    ) : (
                        sessions.map((session, i) => (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                key={i}
                                className="rounded-lg whitespace-pre-wrap text-md text-foreground/95 max-w-sm"
                            >
                                <div className={`${session.id === currentSessionId ? 'bg-foreground/15' : null} flex items-center justify-between mx-auto cursor-pointer
                                            hover:bg-foreground/10 duration-200 transition-all px-4 py-2 mt-1 rounded-lg`}
                                    onClick={() => fetchSession(session.id)}>
                                    <div>{session.title}</div>
                                    <Trash2
                                        className="stroke-[1.5] size-4 cursor-pointer hover:stroke-red-700 z-50"
                                        onClick={() => setModalOpenId(session.id)}
                                    />
                                </div>
                                <DeleteChat
                                    open={modalOpenId === session.id}
                                    setOpen={(val) => setModalOpenId(val ? session.id : null)}
                                    onDeleteSuccess={() => setSessions(sessions.filter(s => s.id !== session.id))}
                                    sessionId={session.id}
                                />
                            </motion.div>
                        ))
                    )}
                </motion.div>


            </div>

            <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex-1 px-6 py-4 space-y-4 bg-background">
                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            key={i}
                            className={`
								rounded-lg p-4 whitespace-pre-wrap border text-foreground/90
								${msg.sender === 'user'
                                    ? 'bg-foreground/10 ml-auto border-r-6 border-r-green-800 max-w-sm'
                                    : 'bg-foreground/10 mr-auto border-l-6 border-l-blue-800 max-w-2xl'}
							`}
                        >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="bg-background/90 px-6 py-4 w-full sticky bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.1)]">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex justify-center items-center gap-2 max-w-4xl mx-auto">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChatQuery()}
                                className={`flex-1 px-4 py-2 border border-foreground/20 rounded-2xl
									focus:ring-1 focus:ring-black/02 bg-foreground/10 text-foreground`}
                                placeholder="Ask anything..."
                                disabled={loading}
                            />
                            <div className=''>
                                <button
                                    className="cursor-pointer rounded-full text-background bg-foreground p-2 z-100"
                                    onClick={handleChatQuery}
                                >
                                    <MoveUp size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
