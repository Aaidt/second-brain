import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
// import { Session } from "@supabase/supabase-js";
// import axios from "axios";

export default function Auth() {
   const navigate = useNavigate();
   const [isLogin, setIsLogin] = useState(true);
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   // const [session, setSession] = useState<Session | null>(null);

   //  useEffect(() => {
   //      supabase.auth.getSession().then(({ data }) => {
   //        setSession(data.session);
   //      });
    
   //      const {
   //        data: { subscription },
   //      } = supabase.auth.onAuthStateChange((_event, session) => {
   //        setSession(session);
   //      });
    
   //      return () => subscription.unsubscribe();
   //    }, []);
      
   // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

   const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
         const { error } = isLogin
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });

         // const user_data = await axios.post(`${BACKEND_URL}/api/second-brain/auth/sync-user`, {
         //    headers: { Authorization: `Bearer ${session?.access_token}`}
         // });
         // console.log("user data: ", user_data);
         if (error) throw error;
         navigate("/dashboard");
      } catch (err) {
         setError(err as string);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
         {/* Background Glow */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[120px]" />
         </div>

         {/* Header/Logo */}
         <header className="p-8">
            <div
               onClick={() => navigate("/")}
               className="flex items-center gap-2 cursor-pointer group w-fit"
            >
               <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg group-hover:border-teal-500/50 transition-colors">
                  <Brain className="h-5 w-5 text-teal-400" />
               </div>
               <span className="font-black italic tracking-tighter text-xl">SecondBrain</span>
            </div>
         </header>

         <main className="flex-grow flex items-center justify-center px-6 pb-20">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full m  -w-md"
            >
               {/* Card Wrapper */}
               <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-2xl">
                  <div className="mb-10">
                     <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
                        {isLogin ? "Welcome Back" : "Create Account"}
                     </h1>
                     <p className="text-white/40 font-medium">
                        {isLogin ? "Your second brain is waiting." : "Start building your digital library today."}
                     </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4">
                     {/* Email Input */}
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">Email Address</label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-teal-400 transition-colors" />
                           <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 transition-all outline-none"
                              placeholder="name@example.com"
                           />
                        </div>
                     </div>

                     {/* Password Input */}
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">Password</label>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-teal-400 transition-colors" />
                           <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 transition-all outline-none"
                              placeholder="••••••••"
                           />
                        </div>
                     </div>

                     <AnimatePresence mode="wait">
                        {error && (
                           <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                           >
                              {error}
                           </motion.p>
                        )}
                     </AnimatePresence>

                     <button
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-4 rounded-2xl mt-6 hover:bg-teal-500 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                           <>
                              {isLogin ? "SIGN IN" : "REGISTER"}
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                           </>
                        )}
                     </button>
                  </form>

                  {/* Social Auth Divider */}
                  <div className="relative my-8">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                     </div>
                     <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                        {/* <span className="bg-white/0 px-4 text-white/20">Or continue with</span> */}
                     </div>
                  </div>

                  <button
                     onClick={async () => {
                        setLoading(true);
                        try {
                           
                           const { error } = await supabase.auth.signInWithOAuth({
                              provider: 'google',
                              options: {
                                 redirectTo: `${window.location.origin}/dashboard`
                              }
                           });
                           if (error) throw error;
                        } catch (err) {
                           setError(err as string);
                           setLoading(false);
                        }
                     }}
                     disabled={loading}
                     className="w-full bg-black/40 border border-white/10 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                     </svg>
                     Google
                  </button>

                  <div className="mt-10 text-center">
                     <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs font-bold text-white/40 hover:text-teal-400 transition-colors uppercase tracking-widest"
                     >
                        {isLogin ? "Don't have an account? Create one" : "Already have an account? Log in"}
                     </button>
                  </div>
               </div>
            </motion.div>
         </main>

         <footer className="p-8 text-center text-[10px] text-white/20 font-black uppercase tracking-widest">
            Securely encrypted via Supabase
         </footer>
      </div>
   );
}
