import {
   ArrowRight,
   Brain,
   Check,
   BookOpen,
   Lightbulb,
   Zap,
   ChevronDown,
 } from "lucide-react";
 import { useNavigate } from "react-router-dom";
 import { useEffect, useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { supabase } from "@/lib/supabase";
 import { Session } from "@supabase/supabase-js";
 
 export function LandingPage() {
   const navigate = useNavigate();
   const [session, setSession] = useState<Session | null>(null);
   const [openFaq, setOpenFaq] = useState<number | null>(null);
 
   useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
     });
   }, []);
 
   const pricingTiers = [
     {
       name: "Free",
       price: "$0",
       description: "Perfect for getting started",
       features: ["Up to 100 notes", "Basic organization", "Mobile access", "Community support"],
       buttonText: "Get Started",
     },
     {
       name: "Pro",
       price: "$9.99",
       period: "/month",
       popular: true,
       description: "For serious thinkers",
       features: ["Unlimited notes", "AI-powered insights", "Advanced linking", "Priority support", "Custom themes"],
       buttonText: "Start Free Trial",
     },
     {
       name: "Enterprise",
       price: "Custom",
       description: "For organizations",
       features: ["Everything in Pro", "Team collaboration", "Advanced security", "Custom integrations", "SLA guarantee"],
       buttonText: "Contact Sales",
     },
   ];
 
   const faqs = [
     {
       q: "What is SecondBrain?",
       a: "SecondBrain is a digital knowledge system that helps you capture, connect, and retrieve ideas using AI-assisted context and neural linking.",
     },
     {
       q: "Is my data private?",
       a: "Absolutely. Your notes are private by default, encrypted at rest, and we never use your personal data to train public models.",
     },
     {
       q: "Can I export my data?",
       a: "Yes. We believe in data sovereignty. You can export your entire library as Markdown or JSON at any time.",
     },
   ];
 
   return (
     <div className="min-h-screen bg-[#050505] text-white selection:bg-teal-500/30 selection:text-teal-200 font-sans">
       {/* BACKGROUND ACCENTS */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
         <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-teal-600/5 blur-[100px]" />
       </div>
 
       {/* NAVBAR */}
       <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer group">
             <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-teal-500/50 transition-colors">
               <Brain className="h-6 w-6 text-teal-400" />
             </div>
             <span className="text-xl font-bold tracking-tighter italic">SecondBrain</span>
           </div>
 
           <div className="flex items-center gap-8">
             <nav className="hidden md:flex gap-8 text-sm font-medium text-white/50">
               <a href="#features" className="hover:text-teal-400 transition-colors">Product</a>
               <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
               <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
             </nav>
             {session ? (
               <button onClick={() => navigate("/dashboard")} className="h-10 w-10 rounded-full bg-teal-500 text-black font-bold flex items-center justify-center shadow-lg shadow-teal-500/20">
                 {session.user?.email?.[0]?.toUpperCase()}
               </button>
             ) : (
               <button onClick={() => navigate("/login")} className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-teal-400 transition-all active:scale-95">
                 Get started
               </button>
             )}
           </div>
         </div>
       </header>
 
       <main>
         {/* HERO SECTION */}
         <section className="relative max-w-7xl mx-auto px-6 pt-18 pb-32 text-center lg:text-left grid lg:grid-cols-5 gap-16 items-center">
           <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
             <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-bold rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 tracking-widest uppercase">
               <Zap className="h-3 w-3 fill-teal-400" /> Augmented Intelligence
             </div>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
               Your mind, <br />
               <span className="text-teal-400 italic font-serif font-light">supercharged.</span>
             </h1>
             <p className="text-xl text-white/50 max-w-xl mb-12 leading-relaxed">
               SecondBrain is the minimal interface for complex thinkers. Capture everything, connect context, and retrieve insight instantly.
             </p>
             <div className="flex flex-col sm:flex-row items-center gap-4">
               <button onClick={() => navigate("/login")} className="px-10 py-5 rounded-full bg-teal-500 text-black font-black hover:bg-white transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2">
                 BUILD YOUR BRAIN <ArrowRight className="h-5 w-5" />
               </button>
             </div>
           </motion.div>
 
           <motion.div className="lg:col-span-2 hidden lg:block" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
             <div className="relative p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="space-y-6">
                   {[
                     { icon: <Lightbulb className="text-teal-400" />, text: "Idea captured in 0.2s" },
                     { icon: <BookOpen className="text-blue-400" />, text: "Context automatically linked" },
                     { icon: <Brain className="text-purple-400" />, text: "AI surfaces hidden patterns" }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                         {item.icon}
                         <span className="font-medium text-white/80">{item.text}</span>
                     </div>
                   ))}
                </div>
             </div>
           </motion.div>
         </section>
 
         {/* COMBINED FEATURES & PRICING SECTION */}
         <section id="features" className="py-24 bg-white text-black rounded-[40px] mx-4 lg:mx-8 mb-24 overflow-hidden shadow-2xl shadow-teal-500/5">
           <div className="container mx-auto px-6 lg:px-12">
             {/* Features Header */}
             <div className="text-center mb-20">
               <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">Powerful Features</h2>
               <p className="text-xl text-black/50 max-w-2xl mx-auto font-medium">Everything you need to build and organize your knowledge</p>
             </div>

             {/* Features Row */}
             <div className="grid md:grid-cols-3 gap-8 mb-32">
               {[
                 { 
                   icon: <Lightbulb className="h-7 w-7" />, 
                   title: "Rapid Capture", 
                   desc: "Instantly jot down thoughts. No friction, no folders, just flow.",
                   color: "bg-amber-50 border-amber-200",
                   iconColor: "text-amber-600"
                 },
                 { 
                   icon: <BookOpen className="h-7 w-7" />, 
                   title: "Deep Context", 
                   desc: "Our AI resurfaces what you learned months ago, exactly when you need it.",
                   color: "bg-teal-50 border-teal-200",
                   iconColor: "text-teal-600"
                 },
                 { 
                   icon: <Brain className="h-7 w-7" />, 
                   title: "Neural Linking", 
                   desc: "Build a web of knowledge. Visualize how every idea connects to the next.",
                   color: "bg-purple-50 border-purple-200",
                   iconColor: "text-purple-600"
                 }
               ].map((item, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   className="group cursor-default p-8 rounded-3xl border border-black/15 hover:border-black/20 hover:shadow-xl transition-all duration-300 bg-white"
                 >
                   <div className={`inline-flex p-4 rounded-2xl border mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                     <div className={item.iconColor}>{item.icon}</div>
                   </div>
                   <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                   <p className="text-black/60 leading-relaxed font-medium">{item.desc}</p>
                 </motion.div>
               ))}
             </div>
 
             {/* Pricing Row */}
             <div id="pricing" className="text-center mb-20 pt-16 border-t border-black/10">
                <h2 className="text-5xl md:text-6xl font-black uppercase mb-4 tracking-tighter">Simple Pricing</h2>
                <p className="text-xl text-black/50 max-w-2xl mx-auto font-medium mt-4">Choose the plan that fits your needs</p>
                <div className="w-20 h-1 bg-teal-500 mx-auto mt-6" />
             </div>

             <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-12">
               {pricingTiers.map((tier, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   className={`relative p-10 rounded-3xl border-2 transition-all duration-300 ${
                     tier.popular 
                       ? 'bg-black text-white border-black scale-105 shadow-2xl shadow-black/30' 
                       : 'bg-[#FBFBFA] border-black/10 hover:border-black/30 hover:shadow-xl'
                   }`}
                 >
                   {tier.popular && (
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-black text-xs font-black px-5 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                       Most Popular
                     </div>
                   )}
                   <div className="mb-8">
                     <h3 className={`font-bold text-xs uppercase tracking-widest mb-3 ${tier.popular ? 'text-teal-400' : 'text-black/40'}`}>
                       {tier.name}
                     </h3>
                     <div className="flex items-baseline gap-2 mb-4">
                       <span className="text-6xl font-black">{tier.price}</span>
                       {tier.period && (
                         <span className={`text-lg ${tier.popular ? 'text-white/50' : 'text-black/40'}`}>
                           {tier.period}
                         </span>
                       )}
                     </div>
                     <p className={`text-sm ${tier.popular ? 'text-white/70' : 'text-black/60'}`}>
                       {tier.description}
                     </p>
                   </div>
                   <ul className="space-y-4 mb-10">
                     {tier.features.map((f, idx) => (
                       <li key={idx} className="flex items-start gap-3">
                         <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${tier.popular ? 'text-teal-400' : 'text-teal-600'}`} />
                         <span className={`text-sm ${tier.popular ? 'text-white/90' : 'text-black/80'} font-medium`}>
                           {f}
                         </span>
                       </li>
                     ))}
                   </ul>
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => navigate("/login")}
                     className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                       tier.popular 
                         ? 'bg-teal-500 text-black hover:bg-teal-400 shadow-lg shadow-teal-500/30' 
                         : 'bg-black text-white hover:bg-neutral-800'
                     }`}
                   >
                     {tier.buttonText}
                   </motion.button>
                 </motion.div>
               ))}
             </div>
           </div>
         </section>
 
         {/* FAQ SECTION */}
         <section id="faq" className="max-w-3xl mx-auto px-6 py-28">
           <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter">Common Questions</h2>
           <div className="space-y-4">
             {faqs.map((faq, i) => (
               <div key={i} className="border border-white/10 rounded-[20px] bg-white/5 overflow-hidden transition-colors hover:border-teal-500/30">
                 <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                   <span className="font-bold text-lg">{faq.q}</span>
                   <ChevronDown className={`h-5 w-5 text-teal-400 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                 </button>
                 <AnimatePresence>
                   {openFaq === i && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 80, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-white/50 leading-relaxed">
                       {faq.a}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
           </div>
         </section>
 
         {/* FINAL CTA */}
         <section className="py-40 text-center relative overflow-hidden">
           <div className="relative z-10 container mx-auto px-6">
             <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter italic">Ready to think bigger?</h2>
             <button onClick={() => navigate("/login")} className="px-16 py-6 rounded-full bg-white text-black font-black text-lg hover:bg-teal-500 transition-all shadow-2xl shadow-white/5 active:scale-95">
               GET STARTED NOW
             </button>
           </div>
         </section>
       </main>
 
       {/* FOOTER */}
       <footer className="border-t border-white/5 py-12">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center gap-8">
           <div className="flex items-center gap-2 font-black italic text-xl">
              <div className="bg-white p-1 rounded-lg"><Brain className="h-5 w-5 text-black" /></div>
              SecondBrain
           </div>
           <div className="flex gap-8 text-white/40 text-xs font-bold uppercase tracking-widest">
             <span>© 2025 All Rights Reserved</span>
             <a href="#" className="hover:text-teal-400">Privacy</a>
             <a href="#" className="hover:text-teal-400">Terms</a>
           </div>
         </div>
       </footer>
     </div>
   );
 }