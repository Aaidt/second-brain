import { Button } from "../components/ui/NativeButton"
import { useNavigate } from "react-router-dom"
import { Check, Brain } from "lucide-react"
import { motion } from 'framer-motion'

export function PricingPage() {
    const navigate = useNavigate();

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
        <div className="scroll-smooth text-foreground/95 bg-background min-h-screen flex flex-col justify-between">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <Brain className="size-8 stroke-[1.5] mt-1" />
                    <span className="text-4xl font-playfair font-medium">SecondBrain</span>
                </div>
                <div onClick={() => navigate("/")} className="font-medium">
                    <Button
                        hover={true} text="Back to Home"
                        bg_color="defaultTheme"
                        shadow={false}
                        fullWidth={false}
                        size="md"
                    />
                </div>
            </div>

            <main className="flex-grow">
                <section className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16">
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
                                className={`bg-background/95 text-foreground/90 p-8 rounded-xl border border-foreground/40 ${tier.popular
                                    ? 'shadow-xl hover:shadow-foreground/20 duration-300 shadow-foreground/5'
                                    : 'hover:shadow-xl duration-300 shadow-foreground/10'
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="bg-foreground/90 text-background text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
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

                <section className="text-foreground/95 py-20">
                    <div className="container mx-auto px-4 text-center py-20 border-t border-foreground/30">
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
                                    key={index} className="border-b border-foreground/20 p-2 pb-8">
                                    <h3 className="text-2xl mb-2">{faq.question}</h3>
                                    <p className="text-lg">{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* <Footer /> */}
        </div>
    )
}