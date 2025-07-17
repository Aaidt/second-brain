import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SendHorizontal, ChevronDown, Brain, PanelLeftClose, PanelRightClose, Trash2, SquarePen, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { DeleteChat } from "../components/ui/DeleteChat"
import { getAccessToken, refreshAccessToken } from '../auth';

interface axiosResponse {
	answers: string;
	references: { title: string; thoughts: string }[];
	title: string;
}

type Message  = {
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

interface titleUpdateResponse{
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
	const [isClosed, setIsClosed] = useState<boolean>(false);
	const [sessions, setSessions] = useState<SessionResponse[]>([]);
	const [modalOpenId, setModalOpenId] = useState<string | null>(null);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) };

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

    const tokenRef = useRef<string | null>(getAccessToken())

    async function ensureToken(){
        if(!tokenRef.current){
            tokenRef.current = await refreshAccessToken(BACKEND_URL);
        }
        if(!tokenRef.current) {
			toast.error("Please log in.")
			navigate("/login")
			return;
		}
        return tokenRef.current;
    }

	async function init() {
        const token = await ensureToken()
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
		try{
			const response = await axios.post<{ session: SessionResponse }>(`${BACKEND_URL}/second-brain/api/chatSession/create`, 
				{ title: "Untitled" },
				{ headers: { Authorization: `Bearer ${token}` } }
			);  

			const newSession = response.data?.session
			setCurrentSessionId(newSession.id)
			setMessages([])
			setReferences([])
			setQuery('')
		}catch(err){
			toast.error('Could not start a new chat.')
			console.error('Could not start a new chat. ' + err)
		}
	}

	async function sendMessage(message: Message, sessionId: string | null) {
		if(!sessionId) return 

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
            toast.error("Start a chat before sending a message.");
            return;
        }

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

			if(messages.filter(m => m.sender === "user").length === 1 && currentSessionId){
				const newTitle = res.data?.title || "New chat"

				const response = await axios.put<titleUpdateResponse>(`${BACKEND_URL}/second-brain/api/chatSession/update/${currentSessionId}`, 
					{ title: newTitle },
					{headers: { Authorization: `Bearer ${token}` } }
				)
				toast.info(response.data?.message)
			}
			init()
		} catch (err) {
			toast.error('Error fetching response');
			console.error(err)
		}

		setQuery('');
		setLoading(false);
	}

    async function fetchSession(sessionId: string){
        const token = await ensureToken()

        try{
            setMessages([])
            const response = await axios.get<SessionResponse>(`${BACKEND_URL}/second-brain/api/chatSession/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessages(response.data?.message)
        }catch(err){
            toast.error("Could not fetch that session");
            console.error("Error is: " + err);
        }
    }

	return (
		<div className="h-screen w-screen grid grid-cols-[340px_1fr] overflow-hidden">
			<div
				className={`bg-white border-r border-black/15 overflow-hidden overflow-y-auto p-4 duration-300 transition-all ${
					isClosed ? 'w-15' : 'w-85'
				}`}
			>
				{isClosed ? (
					<PanelRightClose
						className="cursor-pointer size-6 stroke-[1.5]"
						onClick={() => setIsClosed(false)}
					/>
				) : (
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
							<PanelLeftClose
								className="cursor-pointer size-6 stroke-[1.5]"
								onClick={() => setIsClosed(true)}
							/>
						</div>
						<div className='pb-3'>
							<div className="flex items-center mb-2 text-gray-800 px-4 py-2 hover:bg-gray-200 duration-200 transition-all rounded-md w-full cursor-pointer"
								onClick={handleNewChat}>
								<SquarePen size="18" className='mr-4' />
									New chat
							</div>
						{/* 
							<div className="flex items-center mb-2 text-gray-800 py-2 hover:bg-gray-200 rounded-md px-2 cursor-pointer">
								<Search size="18" className='mr-4' />
									Search chats
							</div> */}
						</div>
						<h3 className="font-semibold mb-2 text-gray-800">Sources from your thoughts:</h3>
						
							{references.length === 0 ? (
								<p className="text-gray-500 text-sm pt-2">No queries sent.</p>
							) : (references.map((ref, idx) => (
                                <motion.div
										initial={{ opacity: 0, y: -20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.3 }}
										className="space-y-4 pr-2"
                                        key={idx} 
									>
                                    <div className="bg-gray-100 border text-black rounded-md p-3 shadow-sm">
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
                                            className="text-sm text-gray-700 whitespace-pre-wrap"
                                            >
                                                {ref.thoughts}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
							)))}
							<div className='flex justify-between items-center mx-1 pt-8 mb-2 '>
								<h3 className="font-semibold text-gray-800 ">Previous chats:</h3>
								<RefreshCcw onClick={init} className="stroke-[1.5] size-4 cursor-pointer" />
							</div>
						{sessions.length === 0 ? (
								<p className="text-gray-500 text-sm pt-2">No previous chats.</p>
							) : (
								sessions.map((session) => (
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.4 }}
										key={session.id}
										className="rounded-lg p-1 whitespace-pre-wrap my-1 text-md text-black max-w-sm "
									>
										<div className='flex items-center justify-between mx-auto cursor-pointer hover:bg-gray-200 
											duration-200 transition-all px-4 py-2 rounded-lg ' onClick={() => fetchSession(session.id)}>
											<div>{session.title}</div>
											<Trash2
												className="stroke-[1.5] size-4 cursor-pointer"
												onClick={() => setModalOpenId(session.id)}
											/>
										</div>
										<DeleteChat
											open={modalOpenId === session.id}
											setOpen={(val) => setModalOpenId(val ? session.id : null)}
											onDeleteSuccess={() => setSessions([])}
											sessionId={session.id}
										/>
									</motion.div>
								))
							)}
					</motion.div>
				)}
				
				
			</div>

			<div className="flex flex-col h-full overflow-y-auto">
				<div className="flex-1 px-6 py-4 space-y-4 bg-white">
					{messages.map((msg, i) => (
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4 }}
							key={i}
							className={`
								rounded-lg p-4 whitespace-pre-wrap border text-white
								${msg.sender === 'user'
									? 'bg-black/87 ml-auto border-r-6 border-r-green-600 max-w-sm'
									: 'bg-black/87 mr-auto border-l-6 border-l-blue-700 max-w-2xl'}
							`}
						>
							<ReactMarkdown>{msg.content}</ReactMarkdown>
						</motion.div>
					))}
					<div ref={messagesEndRef} />
				</div>

				<div className="bg-white p-3 ml-15 sticky bottom-0 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
					>
						<div className="flex gap-2 max-w-4xl">
							<div className="w-220 flex items-center">
								<input
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleChatQuery()}
									className="flex-1 px-4 py-2 border-2 w-full border-gray-400 rounded-md text-base"
									placeholder="Ask anything..."
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
		</div>
	);
}