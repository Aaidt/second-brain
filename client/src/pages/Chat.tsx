import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MoveUp, ChevronDown, Brain, Trash2, SquarePen, RefreshCcw, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { DeleteChat } from "../components/ui/DeleteChat"
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

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
   const [session, setSession] = useState<Session | null>(null);

   useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
      });
  
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
  
      return () => subscription.unsubscribe();
    }, []);

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

   const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   useEffect(() => {
      toast.warn("Click on NEW CHAT to create a session before chatting!!!!!")
   }, [])

   const init = useCallback(async () => {
      toast.info("Fetching sessions..." )
      if(session?.access_token) {
      try {
         const fetchedSessions = await axios.get<{ sessions: SessionResponse[] }>(
            `${BACKEND_URL}/api/second-brain/chatSession`,
            { headers: { Authorization: `Bearer ${session?.access_token}` } }
         );
         setSessions(fetchedSessions.data.sessions || []);
      } catch (err) {
         console.error('Error fetching chats:', err);
         toast.error('Error fetching saved chats');
         setSessions([]);
      }
   }
   }, [session?.access_token]);

   useEffect(() => {
      init()
   }, [init]);


   async function handleNewChat() {
      if(!session?.access_token) return 
      try {
         const response = await axios.post<{ session: SessionResponse }>(`${BACKEND_URL}/api/second-brain/chatSession/create`,
            { title: `New chat ${(Math.random()).toString().slice(0, 8)}` },
            { headers: { Authorization: `Bearer ${session.access_token}` } }
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
      if(!session?.access_token) return 
      if (!sessionId) return

      try {
         await axios.post(
            `${BACKEND_URL}/api/second-brain/chatMessage/send/${sessionId}`,
            { sender: message.sender, content: message.content },
            { headers: { Authorization: `Bearer ${session?.access_token}` } }
         );
      } catch (err) {
         console.error('Error sending queries:', err);
         toast.error('Failed to send queries');
      }
   }

   async function handleChatQuery() {
      if(!session?.access_token) return 
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
         const res = await axios.post<axiosResponse>(`${BACKEND_URL}/api/second-brain/chatMessage/chat-query`,
            { query },
            { headers: { Authorization: `Bearer ${session.access_token}` } }
         );

         const aiResponse = res.data?.answers || 'No answer';
         const aiMessage: Message = { sender: 'ai', content: aiResponse };
         setReferences(res.data?.references || []);
         setMessages((prev) => [...prev, aiMessage]);
         await sendMessage(aiMessage, currentSessionId);

         if (isFirstUserMessage && currentSessionId) {
            const newTitle = res.data?.title || "New chat"

            await axios.put<titleUpdateResponse>(`${BACKEND_URL}/api/second-brain/chatSession/update/${currentSessionId}`,
               { title: newTitle },
               { headers: { Authorization: `Bearer ${session.access_token}` } }
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
      if(!session?.access_token) return 
      try {
         setMessages([])
         const response = await axios.get<{ session: SessionResponse }>(`${BACKEND_URL}/api/second-brain/chatSession/${sessionId}`, {
            headers: { Authorization: `Bearer ${session?.access_token}` }
         })
         setCurrentSessionId(response.data.session.id)
         setMessages(response.data?.session.message)
      } catch (err) {
         toast.error("Could not fetch that session");
         console.error("Error is: " + err);
      }
   }

   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
       <div className={`h-screen w-screen grid ${isSidebarOpen ? "grid-cols-[340px_1fr]" : "grid-cols-[0px_1fr]"} overflow-hidden bg-[#050505] text-[#E5E5E5] font-sans antialiased selection:bg-teal-500/30 selection:text-teal-200 relative transition-all duration-300 ease-in-out`}>
          {/* NOISE GRAIN OVERLAY */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
 
          {/* REFINED BACKGROUND ACCENTS */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-teal-500/5 blur-[140px]" />
             <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[140px]" />
          </div>

          <div
             className={`bg-black/20 backdrop-blur-xl border-r border-white/10 overflow-hidden overflow-y-auto p-4 duration-300 transition-all z-10 relative
             ${!isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
             `}
          >
             <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
             >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 items-center cursor-pointer group" onClick={() => navigate('/dashboard')}>
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 group-hover:border-teal-500/50 transition-all">
                        <Brain className="size-5 text-teal-400 stroke-[1.5]" />
                      </div>
                      <span className="font-bold tracking-tight uppercase text-lg text-white/90 group-hover:text-white transition-colors">SecondBrain</span>
                   </div>
                   <div onClick={() => setIsSidebarOpen(false)} className="cursor-pointer text-white/40 hover:text-white transition-colors">
                        <PanelLeftClose size={20} />
                   </div>
                </div>

                <div className='pb-6'>
                   <button 
                      className="flex items-center justify-center w-full py-3 px-4 rounded-xl bg-teal-400/10 text-teal-400 border border-teal-400/20 hover:bg-teal-400/20 hover:border-teal-400/40 transition-all duration-300 font-bold text-sm tracking-wide uppercase group mb-2"
                      onClick={handleNewChat}>
                      <SquarePen size="18" className='mr-2 group-hover:scale-110 transition-transform' />
                      New chat
                   </button>
                </div>
                
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-4 px-2">Thoughts Referenced</h3>

                {references.length === 0 ? (
                   <div className="px-2 py-8 text-center border border-dashed border-white/5 rounded-xl">
                      <p className="text-white/20 text-xs font-medium">No references yet</p>
                   </div>
                ) : (references.map((ref, idx) => (
                   <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 mb-2"
                      key={idx}
                   >
                      <div className="bg-white/5 border border-white/5 hover:border-white/10 text-white/80 rounded-xl p-3 shadow-none transition-all">
                         <div className="flex items-center justify-between group cursor-pointer" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                            <h3 className="mb-px text-xs font-bold line-clamp-1">{ref.title}</h3>
                            <ChevronDown
                               className={`size-4 text-white/40 group-hover:text-white transition-colors duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                            />
                         </div>
                         <AnimatePresence>
                         {openIndex === idx && (
                            <motion.div
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: "auto", opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="overflow-hidden"
                            >
                               <div className="pt-3 text-xs text-white/50 leading-relaxed border-t border-white/5 mt-2">
                                  {ref.thoughts}
                               </div>
                            </motion.div>
                         )}
                         </AnimatePresence>
                      </div>
                   </motion.div>
                )))}
                
                <div className='flex justify-between items-center px-2 mt-8 mb-4 border-t border-white/5 pt-6'>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">History</h3>
                   <RefreshCcw onClick={init} className="stroke-[1.5] size-3.5 text-white/30 cursor-pointer 
                                     hover:rotate-180 hover:text-teal-400 transition-all duration-300" />
                </div>
                <div className="space-y-1">
                {sessions.length === 0 ? (
                   <p className="px-2 text-white/20 text-xs">No previous chats.</p>
                ) : (
                   sessions.map((session, i) => (
                      <motion.div
                         initial={{ opacity: 0 }}
                         whileInView={{ opacity: 1 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.4 }}
                         key={i}
                         className="group relative"
                      >
                         <div className={`${session.id === currentSessionId ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'} 
                                            flex items-center justify-between cursor-pointer
                                            duration-200 transition-all px-3 py-2.5 rounded-lg text-sm font-medium`}
                            onClick={() => fetchSession(session.id)}>
                            <div className="truncate pr-6">{session.title}</div>
                            <Trash2
                               className="opacity-0 group-hover:opacity-100 absolute right-2 stroke-[1.5] size-3.5 cursor-pointer text-white/20 hover:text-red-400 transition-all"
                               onClick={(e) => { e.stopPropagation(); setModalOpenId(session.id); }}
                            />
                         </div>
                      </motion.div>
                   ))
                )}
                </div>
             </motion.div>


          </div>
          
          <DeleteChat
            open={!!modalOpenId}
            setOpen={(val) => setModalOpenId(val ? modalOpenId : null)} // Only close
            onDeleteSuccess={() => {
                setSessions(sessions.filter(s => s.id !== modalOpenId));
                setModalOpenId(null);
            }}
            sessionId={modalOpenId || ""}
         />

          <div className="flex flex-col h-full overflow-hidden relative z-10">
             {!isSidebarOpen && (
                 <div className="absolute top-4 left-4 z-50">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg bg-black/20 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all backdrop-blur-md"
                    >
                        <PanelRightClose size={20} />
                    </button>
                 </div>
             )}
             <div className="h-full w-full relative">
                 <div className="absolute inset-0 overflow-y-auto px-4 md:px-20 pt-8 pb-28 scrollbar-hide space-y-6">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
                         <Brain className="size-24 mb-4 text-white/20" />
                         <p className="text-xl font-kalam text-white/40 rotate-[-2deg]">Start thinking...</p>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                       <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                          key={i}
                          className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                       >
                         <div className={`
                             rounded-2xl p-5 md:p-6 whitespace-pre-wrap max-w-3xl text-sm md:text-base leading-relaxed font-medium shadow-xl backdrop-blur-sm
                             ${msg.sender === 'user'
                                ? 'bg-teal-500/10 border border-teal-500/20 text-teal-50 rounded-br-none'
                                : 'bg-[#111] border border-white/10 text-white/80 rounded-bl-none'}
                          `}>
                          <ReactMarkdown 
                            components={{
                               code: ({node, ...props}) => <code className="bg-black/30 rounded px-1.5 py-0.5 text-xs font-mono" {...props} />
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                          </div>
                       </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                 </div>
    
                 <div className="absolute bottom-0 left-0 w-full px-4 md:px-20 pb-4 pt-10 z-20 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none">
                    <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8 }}
                       className="pointer-events-auto"
                    >
                       <div className="relative max-w-3xl mx-auto">
                          <div className="flex items-center gap-2 bg-[#212121] p-2 pl-4 rounded-[26px] shadow-lg relative">
                             <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChatQuery()}
                                className="flex-1 py-2 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-[15px]"
                                placeholder="Ask anything..."
                                disabled={loading}
                             />
                             <button
                                className="p-1.5 rounded-full bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200 flex items-center justify-center"
                                onClick={handleChatQuery}
                                disabled={loading || !query.trim()}
                             >
                                {loading ? <RefreshCcw className="animate-spin size-5" /> : <MoveUp className="size-5" strokeWidth={2.5} />}
                             </button>
                          </div>
                       </div>
                       <p className="text-center text-[10px] text-white/30 mt-2 font-medium">
                          AI can make mistakes. Check important info.
                       </p>
                    </motion.div>
                 </div>
             </div>
          </div>
       </div>
    );
 }
