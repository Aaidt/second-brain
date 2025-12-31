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
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] selection:bg-teal-500/30 selection:text-teal-200 font-sans antialiased">
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
                onClick={() => navigate("/login")}
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
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-40">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT COLUMN: TEXT & CTA */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-black rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 tracking-[0.2em] uppercase">
                <Zap className="h-3 w-3 fill-teal-400" /> Neural Knowledge
                System
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-8">
                Your mind, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-100 italic font-serif">
                  augmented.
                </span>
              </h1>

              <p className="text-lg text-white/40 max-w-md leading-relaxed font-medium mb-10">
                The semantic interface for professional thinkers. Capture
                context, visualize connections, and offload your memory to a
                digital nervous system.
              </p>

              {/* REFINED SMALLER BUTTON */}
              <button
                onClick={() => navigate("/login")}
                className="group relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-black text-[11px] tracking-[0.15em] hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/5 active:scale-95"
              >
                INITIALIZE BRAIN
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* RIGHT COLUMN: RELEVANT IMAGE */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="relative z-10 rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/9a/15/d9/9a15d96b98e19134a4103067def8d755.jpg"
                  alt="SecondBrain"
                  className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                />
                {/* Subtle Overlay to blend with dark theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </div>

              {/* Decorative Glow behind image */}
              <div className="absolute -inset-4 bg-teal-500/10 blur-[60px] rounded-full z-0" />
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

            <div className="mb-10">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tighter text-center">
                Features
              </h2>
              <div className="w-20 h-1 bg-teal-500 mx-auto" />
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
              className="text-center mb-20 pt-16 border-t border-black/10"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white uppercase mb-4 tracking-tighter">
                Simple Pricing
              </h2>

              <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium mt-4">
                Choose the plan that fits your needs
              </p>

              <div className="w-20 h-1 bg-teal-500 mx-auto mt-6" />
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
                    className={`relative p-10 lg:p-12 flex flex-col transition-colors duration-500 ${
                      tier.popular
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
                              className={`h-3.5 w-3.5 ${
                                tier.popular ? "text-teal-400" : "text-white/20"
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
                      className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                        tier.popular
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
                      className={`h-4 w-4 ${
                        openFaq === i ? "text-teal-400" : "text-white/20"
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
