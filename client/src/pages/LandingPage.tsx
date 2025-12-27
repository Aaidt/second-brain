import { Button } from "../components/ui/NativeButton"
import { ArrowRight, Brain, Check, BookOpen, Lightbulb } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { motion } from "framer-motion"
import { createClient, Session } from "@supabase/supabase-js";

export function LandingPage() {
   const navigate = useNavigate();

   const [session, setSession] = useState<Session | null>(null)
   const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

   useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
         setSession(session)
      })
   }, [supabase.auth])

   const pricingTiers = [
      {
         name: "Free",
         price: "$0",
         description: "Perfect for getting started",
         features: [
            "Up to 100 notes",
            "Basic organization",
            "Mobile access",
            "Community support"
         ],
         buttonText: "Get Started",
      },
      {
         name: "Pro",
         price: "$9.99",
         period: "/month",
         description: "For serious thinkers",
         features: [
            "Unlimited notes",
            "Advanced organization",
            "AI-powered insights",
            "Priority support",
            "Custom themes",
            "Export options"
         ],
         buttonText: "Start Free Trial",
         popular: true
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
            "Dedicated support",
            "SLA guarantee"
         ],
         buttonText: "Contact Sales"
      }
   ];



   return (
      <div className="text-black/90 bg-white min-h-screen flex font-roboto flex-col justify-between">

         <div className="mx-10 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Brain className="size-8 stroke-[1.5] mt-1" />
               <span className="text-4xl font-medium font-playfair">SecondBrain</span>
            </div>
            {session ? <div>
               <div onClick={() => navigate("/login")} className="rounded-full bg-black px-5 py-3 text-white cursor-pointer font-bold">
                  {session.user?.email?.slice(0, 2).toUpperCase() ?? "U"}
               </div>
            </div> : <div className="font-bold" onClick={() => navigate("/login")}>
               <Button
                  hover={false} size="md"
                  bg_color="defaultTheme" shadow={false}
                  fullWidth={false} text="Login"
               />
            </div>}


         </div>

         <main className="flex-grow">

            <section className="container mx-auto px-4 py-16 relative overflow-hidden">
               <div className="relative z-20 flex flex-col items-center justify-center space-y-8 w-full">
                  <motion.div
                     initial={{ opacity: 0, y: 60 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                     <h1 className="font-playfair tracking-tight text-5xl sm:text-7xl md:text-8xl font-light text-center italic">
                        Your mind deserves <br /> a second brain.
                     </h1>

                     <p className="text-xl pt-5 text-center">
                        Capture ideas. Reflect on your thoughts. <br /> Learn more about yourself.
                     </p>
                  </motion.div>

                  <div className="flex flex-col items-center justify-center sm:flex-row gap-4 pt-4">
                     <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        onClick={() => navigate("/signup")}
                        className="font-medium"
                     >
                        <Button
                           hover={true}
                           text="Start for free"
                           size="md"
                           bg_color="defaultTheme"
                           shadow={false}
                           fullWidth={false}
                        />
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        onClick={() => navigate("/dashboard")}
                     >
                        <Button
                           hover={true}
                           text="Go to dashboard"
                           startIcon={<ArrowRight className="ml-2 h-5 w-5" />}
                           size="md"
                           shadow={false}
                           fullWidth={false}
                           bg_color="defaultText"
                        />
                     </motion.div>
                  </div>
               </div>
            </section>

            <section className="py-10">
               <div className="container mx-auto px-4 py-15 border-t border-black/20">
                  <div className="text-center mb-16">
                     <h2 id="features" className="text-6xl font-playfair italic 
                            font-semibold mb-3">Organize your thoughts
                     </h2>
                     <br />
                     <p className="text-lg">
                        Our powerful tools help you capture, organize, and <br />connect your ideas effortlessly.
                     </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                        {
                           icon: <Lightbulb className="h-10 w-10" />,
                           title: "Capture Ideas",
                           description:
                              "Quickly jot down thoughts before they disappear. Our intuitive interface makes it easy to capture ideas on any device.",
                        },
                        {
                           icon: <BookOpen className="h-10 w-10" />,
                           title: "Reflect & Learn",
                           description:
                              "Review your thoughts and discover patterns. Our AI-powered insights help you understand your thinking better.",
                        },
                        {
                           icon: <Brain className="h-10 w-10" />,
                           title: "Connect & Grow",
                           description:
                              "Link related ideas together to build a network of knowledge that grows with you over time.",
                        },
                     ].map((feature, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ duration: 0.4, delay: index * 0.2 }}
                           className="bg-white/95 border border-black/30 text-black p-8 rounded-xl hover:shadow-lg
                                        hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1"
                        >
                           <div className="bg-white/80 text-black/80 transition-colors 
                                        duration-400 p-4 rounded-full w-fit mb-6">{feature.icon}</div>
                           <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                           <p className="">{feature.description}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>


            <div className="scroll-smooth text-black/95 bg-white min-h-screen flex flex-col justify-between">
               <main className="flex-grow">
                  <section className="container mx-auto px-4 py-20">

                     <div className="container mx-auto px-4 text-center py-20 border-t border-black/30">
                        <h1 className="text-5xl md:text-5xl font-semibold font-playfair mb-3 italic ">Simple, Transparent Pricing</h1><br />
                        <p className="text-xl">
                           Choose the plan that's right for you. All plans include a 14-day free trial.
                        </p>
                     </div>

                     <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                           <motion.div
                              initial={{ opacity: 0, y: -50 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                              key={index}
                              className={`bg-white/95 text-black/90 p-8 rounded-xl border border-black/40 ${tier.popular
                                 ? 'shadow-xl hover:shadow-black/20 duration-300 shadow-black/5'
                                 : 'hover:shadow-xl duration-300 shadow-black/10'
                                 }`}
                           >
                              {tier.popular && (
                                 <div className="bg-black/90 text-white text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                                    Most Popular
                                 </div>
                              )}
                              <h3 className="text-xl font-medium mb-2">{tier.name}</h3>
                              <div className="flex items-baseline mb-4">
                                 <span className="text-4xl font-light font-medium">{tier.price}</span>
                                 {tier.period && <span className="text-lg ml-1">{tier.period}</span>}
                              </div>
                              <p className=" mb-6">{tier.description}</p>
                              <ul className="space-y-3 mb-8">
                                 {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                       <Check className="h-5 w-5 " />
                                       <span>{feature}</span>
                                    </li>
                                 ))}
                              </ul>
                              <div onClick={() => navigate("/signup")}>
                                 <Button
                                    hover={false}
                                    text={tier.buttonText}
                                    size="md"
                                    bg_color="defaultTheme"
                                    shadow={false}
                                    fullWidth={true}
                                 />
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </section>

                  <section className="text-black/95 py-10">
                     <div className="container mx-auto px-4 text-center py-20 border-t border-black/30">
                        <h2 className="text-5xl font-semibold font-playfair mb-6 italic">Frequently Asked Questions</h2><br />
                        <div className="max-w-3xl mx-auto space-y-6">
                           {[
                              {
                                 question: "Can I switch plans later?",
                                 answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                              },
                              {
                                 question: "Is there a free trial?",
                                 answer: "Yes, all paid plans include a 14-day free trial. No credit card required."
                              },
                              {
                                 question: "What happens to my data if I cancel?",
                                 answer: "Your data remains accessible even after cancellation. You can export your data at any time."
                              }
                           ].map((faq, index) => (
                              <motion.div
                                 initial={{ opacity: 0 }}
                                 whileInView={{ opacity: 1 }}
                                 viewport={{ once: true }}
                                 transition={{ duration: 0.4, ease: "easeOut" }}
                                 key={index} className="border-b border-black/20 p-2 pb-8">
                                 <h3 className="text-2xl mb-2">{faq.question}</h3>
                                 <p className="text-lg">{faq.answer}</p>
                              </motion.div>
                           ))}
                        </div>
                     </div>
                  </section>
               </main>

            </div>



            <section className="py-10">
               <div className="container mx-auto pb-4 text-center pt-15 border-t border-black/20">
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                     <h2 className="text-6xl font-semibold italic font-playfair mb-3">Ready to upgrade your thinking?</h2><br />
                     <p className="text-lg text-center mb-5">
                        Join thousands of users who have transformed how they capture and connect ideas.<br /> Start for free, no credit
                        card required.
                     </p>
                  </motion.div>
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, ease: "easeOut" }} className="flex font-medium justify-center items-center "
                     onClick={() => navigate("/login")}>
                     <Button
                        hover={true} text="Get started now"
                        size="md" shadow={false}
                        fullWidth={false}
                        bg_color="defaultTheme"
                     />
                  </motion.div>
               </div>
            </section>
         </main>

      </div>
   )
}
