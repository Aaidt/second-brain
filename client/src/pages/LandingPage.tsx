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
         features: [
            "Up to 100 notes",
            "Basic organization",
            "Mobile access",
            "Community support",
         ],
         buttonText: "Get Started",
      },

      {
         name: "Pro",
         price: "$9.99",
         period: "/month",
         popular: true,
         description: "For serious thinkers",
         features: [
            "Unlimited notes",
            "AI-powered insights",
            "Advanced linking",
            "Priority support",
            "Custom themes",
         ],
         buttonText: "Start Free Trial",
      },

      {
         name: "Enterprise",
         price: "Custom",
         description: "For organizations",
         features: [
            "Everything in Pro",
            "Team collaboration",
            "Advanced security",
            "Custom integrations",
            "SLA guarantee",
         ],
         buttonText: "Contact Sales",
      },
   ];

   const faqs = [
      {
         q: "How does SecondBrain work?",
         a: "SecondBrain helps you capture, organize, and connect your thoughts. Simply add your ideas, and our AI-powered system automatically links related concepts and helps you discover patterns in your thinking.",
      },
      {
         q: "Is my data secure?",
         a: "Yes, your data is encrypted and stored securely. We take privacy seriously and never share your personal information with third parties.",
      },
      {
         q: "Can I cancel my subscription anytime?",
         a: "Yes, you can cancel your subscription at any time. Your data will remain accessible, and you can export it whenever you need.",
      },
      {
         q: "Do you offer a free trial?",
         a: "Yes, all paid plans include a 14-day free trial. No credit card required to get started.",
      },
      {
         q: "What happens if I exceed my plan limits?",
         a: "We'll notify you before you reach your limits. You can upgrade your plan at any time to continue using SecondBrain without interruption.",
      },
   ];

   return (
      <div className="min-h-screen bg-[#050505] text-[#E5E5E5] selection:bg-teal-500/30 selection:text-teal-200 font-sans antialiased overflow-x-hidden">
         {/* NOISE GRAIN OVERLAY - Makes it look more 'physical' and professional */}
         <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

         {/* REFINED BACKGROUND ACCENTS */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-teal-500/5 blur-[140px]" />
            <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[140px]" />
         </div>

         {/* NAVBAR */}
         <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
               <div
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2.5 cursor-pointer group"
               >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 group-hover:border-teal-500/50 transition-all">
                     <Brain className="h-5 w-5 text-teal-400" />
                  </div>
                  <span className="text-lg font-bold tracking-tight uppercase">
                     SecondBrain
                  </span>
               </div>

               <div className="flex items-center gap-8">
                  <nav className="hidden md:flex gap-8 text-[13px] font-bold uppercase tracking-widest text-white/40">
                     <a
                        href="#features"
                        className="hover:text-white transition-colors"
                     >
                        Features
                     </a>
                     <a href="#pricing" className="hover:text-white transition-colors">
                        Pricing
                     </a>
                     <a href="#faq" className="hover:text-white transition-colors">
                        FAQ
                     </a>
                  </nav>
                  {session ? (
                     <button
                        onClick={() => navigate("/dashboard")}
                        className="h-10 w-10 rounded-full border border-white/10 bg-neutral-900 text-teal-400 font-bold flex items-center justify-center hover:bg-neutral-800 transition-colors"
                     >
                        {session.user?.email?.[0]?.toUpperCase()}
                     </button>
                  ) : (
                     <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-teal-400 transition-all"
                     >
                        SIGN IN
                     </button>
                  )}
               </div>
            </div>
         </header>

         <main>
            {/* HERO SECTION */}
            <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-40 bg-dot-grid-white">
               {/* Sketchy decorative elements */}
               <div className="absolute top-20 left-10 w-24 h-24 border-2 border-teal-500/20 rounded-full blur-xl animate-pulse" />
               <div className="absolute top-40 right-20 w-32 h-32 border-2 border-purple-500/20 rounded-full blur-xl animate-pulse delay-700" />
               
               <div className="grid lg:grid-cols-12 gap-16 items-center">
                  {/* LEFT COLUMN: TEXT & CTA */}
                  <motion.div
                     className="lg:col-span-7 relative z-10"
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                     <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm transform -rotate-2 font-kalam font-bold text-teal-300 border-2 border-teal-500/30 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:scale-105 transition-transform cursor-default">
                        <Zap className="h-4 w-4 fill-teal-300" />
                        <span>Generic memory is out. Context is in.</span>
                     </div>

                     <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8 text-white">
                        Your mind, <br />
                        <span className="relative inline-block">
                           <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200 font-kalam italic transform -rotate-3 inline-block">
                              unleashed.
                           </span>
                           {/* Highlight effect */}
                           <span className="absolute -bottom-2 left-0 right-0 h-4 bg-teal-500/20 -rotate-2 rounded-full blur-sm" />
                        </span>
                     </h1>

                     <p className="text-xl text-neutral-400 max-w-lg leading-relaxed font-medium mb-10 font-kalam">
                        The messy, chaotic, beautiful way you think—now captured perfectly. 
                        Draw connections, map ideas, and never lose a thought again.
                     </p>

                     {/* CTA BUTTONS */}
                     <div className="flex flex-col sm:flex-row items-center gap-6">
                        {session ? (
                           <button
                              onClick={() => navigate("/dashboard")}
                              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-teal-400 bg-teal-400 text-black text-lg font-bold font-kalam hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,184,166,0.5)] transition-all active:translate-y-0 active:shadow-none"
                           >
                              Jump to Dashboard
                              <ArrowRight className="h-5 w-5" />
                           </button>
                        ) : (
                           <button
                              onClick={() => navigate("/login")}
                              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-teal-400 text-black text-lg font-bold font-kalam hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,184,166,0.5)] transition-all active:translate-y-0 active:shadow-none"
                           >
                              Start for free 
                              <ArrowRight className="h-5 w-5 group-hover:rotate-[-45deg] transition-transform" />
                           </button>
                        )}
                        
                        <div className="flex items-center gap-2 text-neutral-500 text-sm font-kalam font-bold transform rotate-2">
                           <div className="w-8 h-px bg-neutral-700" />
                           <span>Free forever for dreamers</span>
                        </div>
                     </div>
                  </motion.div>

                  {/* RIGHT COLUMN: HERO IMAGE */}
                  <motion.div
                     className="lg:col-span-5 relative perspective-1000"
                     initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                     animate={{ opacity: 1, scale: 1, rotate: 3 }}
                     transition={{ duration: 1, delay: 0.2 }}
                  >
                     {/* Roughly drawn border container */}
                     <div className="relative z-10 rounded-2xl bg-[#111] p-2 border-2 border-white/10 shadow-2xl transform hover:rotate-0 transition-transform duration-500">
                         {/* Sketchy border overlay */}
                        <div className="absolute inset-0 border-2 border-white/20 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] pointer-events-none" />
                        
                        <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                            <img
                               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                               alt="SecondBrain Interface"
                               className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            
                            {/* Floating Elements on top of image */}
                            <div className="absolute bottom-6 left-6 right-6">
                               <div className="flex items-center gap-4 mb-4">
                                  <div className="h-10 w-10 rounded-full bg-teal-400 flex items-center justify-center font-bold text-black border-2 border-black rotate-[-6deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                     <Brain className="h-6 w-6" />
                                  </div>
                                  <div className="h-2 w-20 bg-white/20 rounded-full" />
                               </div>
                               <div className="p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 font-kalam text-white/80">
                                  "It's like my brain, but organized."
                               </div>
                            </div>
                        </div>
                     </div>

                     {/* Back layer decoration */}
                     <div className="absolute -inset-4 bg-teal-500/20 blur-[80px] rounded-full z-0 pointer-events-none" />
                  </motion.div>
               </div>
            </section>

            {/* FEATURES & PRICING SECTION - REIMAGINED AS DARK PREMIUM */}
            <section
               id="features"
               className="py-28 bg-[#0A0A0A] border-y border-white/5 relative"
            >
               <div className="container mx-auto px-6 lg:px-12">
                  {/* Features Grid */}

                  <div className="mb-16 text-center">
                     <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter transform -rotate-2">
                        Features
                     </h2>
                     <div className="w-32 h-2 bg-teal-500/80 mx-auto rounded-[255px_15px_225px_15px/15px_225px_15px_255px] rotate-2" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-1 px-4 lg:px-0 mb-32 bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
                     {[
                        {
                           icon: <Lightbulb />,
                           title: "Semantic Capture",
                           desc: "No more tagging. Our AI understands the context of your notes automatically.",
                        },
                        {
                           icon: <BookOpen />,
                           title: "Recursive Recall",
                           desc: "Ideas resurface based on what you are currently writing. Real-time inspiration.",
                        },
                        {
                           icon: <Brain />,
                           title: "Graph Visualization",
                           desc: "See your thoughts as a living network. Find the gaps in your knowledge.",
                        },
                     ].map((item, i) => (
                        <div
                           key={i}
                           className="p-12 bg-[#0A0A0A] hover:bg-[#0E0E0E] transition-colors border-r border-white/5 last:border-r-0"
                        >
                           <div className="text-teal-400 mb-8 p-3 bg-teal-400/5 w-fit rounded-xl border border-teal-400/10">
                              {item.icon}
                           </div>
                           <h3 className="text-xl font-bold mb-4 tracking-tight uppercase">
                              {item.title}
                           </h3>
                           <p className="text-white/40 leading-relaxed text-sm font-medium">
                              {item.desc}
                           </p>
                        </div>
                     ))}
                  </div>

                  {/* Pricing Header */}
                  <div
                     id="pricing"
                     className="text-center mb-20 pt-16 border-t border-dashed border-white/10"
                  >
                     <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter transform rotate-1">
                        Simple Pricing
                     </h2>

                     <p className="text-xl text-white/50 max-w-2xl mx-auto font-kalam transform -rotate-1">
                        Choose the plan that fits your needs (no hidden fees, we promise)
                     </p>

                     <div className="w-40 h-2 bg-teal-500/80 mx-auto mt-8 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] -rotate-1" />
                  </div>

                  {/* Unified Pricing Monolith */}
                  <div className="max-w-6xl mx-auto px-4 lg:px-0">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10"
                     >
                        {pricingTiers.map((tier, i) => (
                           <div
                              key={i}
                              className={`relative p-10 lg:p-12 flex flex-col transition-colors duration-500 ${tier.popular
                                 ? "bg-teal-500/[0.02]"
                                 : "hover:bg-white/[0.02]"
                                 }`}
                           >
                              {/* Popular Badge - Minimalist Tag */}
                              {tier.popular && (
                                 <div className="absolute top-6 right-8">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/10">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">
                                          Recommended
                                       </span>
                                    </div>
                                 </div>
                              )}

                              <div className="mb-10">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">
                                    {tier.name}
                                 </h3>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-bold tracking-tighter">
                                       {tier.price}
                                    </span>
                                    <span className="text-white/20 text-sm font-bold tracking-tight">
                                       {tier.period}
                                    </span>
                                 </div>
                                 <p className="text-white/40 text-sm mt-6 font-medium leading-relaxed max-w-[200px]">
                                    {tier.description}
                                 </p>
                              </div>

                              {/* Features List */}
                              <ul className="space-y-5 mb-12 flex-grow">
                                 {tier.features.map((f, idx) => (
                                    <li
                                       key={idx}
                                       className="flex items-start gap-3 text-[13px] font-medium text-white/70"
                                    >
                                       <div className="mt-1">
                                          <Check
                                             className={`h-3.5 w-3.5 ${tier.popular ? "text-teal-400" : "text-white/20"
                                                }`}
                                          />
                                       </div>
                                       {f}
                                    </li>
                                 ))}
                              </ul>

                              {/* High-Contrast Button */}
                              <button
                                 onClick={() => navigate("/login")}
                                 className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${tier.popular
                                    ? "bg-teal-500 text-black hover:bg-white shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)]"
                                    : "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black"
                                    }`}
                              >
                                 {tier.buttonText}
                              </button>
                           </div>
                        ))}
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="max-w-2xl mx-auto px-6 py-28">
               <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl font-bold text-white uppercase mb-4 tracking-tighter">
                     FAQ
                  </h2>
                  <div className="w-10 h-[4px] bg-teal-500 mx-auto mt-4" />
               </div>
               <div className="space-y-2">
                  {faqs.map((faq, i) => (
                     <div
                        key={i}
                        className="border-b border-white/5 overflow-hidden group"
                     >
                        <button
                           onClick={() => setOpenFaq(openFaq === i ? null : i)}
                           className="w-full flex items-center justify-between py-8 text-left transition-colors"
                        >
                           <span className="font-bold text-sm uppercase tracking-wider group-hover:text-teal-400">
                              {faq.q}
                           </span>
                           <motion.div
                              animate={{ rotate: openFaq === i ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                           >
                              <ChevronDown
                                 className={`h-4 w-4 ${openFaq === i ? "text-teal-400" : "text-white/20"
                                    }`}
                              />
                           </motion.div>
                        </button>
                        <AnimatePresence mode="wait">
                           {openFaq === i && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1],
                                    opacity: { duration: 0.2 },
                                 }}
                                 style={{ overflow: "hidden" }}
                                 className="text-white/40 text-sm leading-relaxed font-medium"
                              >
                                 <div className="pb-8 pt-2">{faq.a}</div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}
               </div>
            </section>

            {/* CTA */}
            <section className="py-40 text-center relative border-t border-white/5">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
               <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter opacity-10">
                  THINK BIGGER
               </h2>
               <button
                  onClick={() => navigate("/login")}
                  className="px-16 py-6 rounded-full bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-teal-500 transition-all shadow-2xl"
               >
                  Get Started
               </button>
            </section>
         </main>

         <footer className="py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-2 font-black italic tracking-tighter">
                  <Brain className="h-4 w-4 text-teal-400" />
                  SecondBrain
               </div>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                  Internal System v2.0.25
               </p>
            </div>
         </footer>
      </div>
   );
}
