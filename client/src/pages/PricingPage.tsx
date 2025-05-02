import { Button } from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { Footer } from "../components/ui/Footer"
import { BrainIcon } from "../components/icons/BrainIcon"
import { Check } from "lucide-react"

export const PricingPage = () => {
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
            buttonColor: "gold"
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
            buttonColor: "gold",
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
            buttonText: "Contact Sales",
            buttonColor: "blue"
        }
    ];

    return (
        <div className="scroll-smooth font-serif bg-[#183B4E] min-h-screen flex flex-col justify-between text-[#DDA853]">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BrainIcon />
                    <span className="text-3xl font-medium">SecondBrain</span>
                </div>
                <div onClick={() => navigate("/")}>
                    <Button text="Back to Home" bg_color="gold" shadow={false} fullWidth={false} size="md" />
                </div>
            </div>

            <main className="flex-grow">
                <section className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-light mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-xl max-w-2xl mx-auto">
                            Choose the plan that's right for you. All plans include a 14-day free trial.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <div
                                key={index}
                                className={`bg-[#132D3C] p-8 rounded-xl border ${
                                    tier.popular 
                                        ? 'border-[#DDA853] shadow-lg shadow-[#DDA853]/20' 
                                        : 'border-[#DDA853]/20'
                                }`}
                            >
                                {tier.popular && (
                                    <div className="bg-[#DDA853] text-[#183B4E] text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-medium mb-2">{tier.name}</h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-light">{tier.price}</span>
                                    {tier.period && <span className="text-lg ml-1">{tier.period}</span>}
                                </div>
                                <p className="text-[#DDA853]/80 mb-6">{tier.description}</p>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-[#DDA853]" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div onClick={() => navigate("/signup")}>
                                    <Button 
                                        text={tier.buttonText} 
                                        size="md" 
                                        bg_color={tier.buttonColor as "gold" | "blue"} 
                                        shadow={false} 
                                        fullWidth={true} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-[#132D3C] py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-light mb-6">Frequently Asked Questions</h2>
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
                                <div key={index} className="bg-[#183B4E] p-6 rounded-xl">
                                    <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
                                    <p className="text-[#DDA853]/80">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}