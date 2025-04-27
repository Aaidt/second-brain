import { Button } from "../components/ui/Button"
import { ArrowRight, Brain, BookOpen, Lightbulb, Star } from "lucide-react"
import { BrainIcon } from "../components/icons/BrainIcon";
import { useNavigate } from "react-router-dom"
import { Footer } from "../components/ui/Footer"

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="font-serif bg-[#183B4E] min-h-screen flex flex-col justify-between text-[#DDA853]">

            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BrainIcon />
                    <span className="text-3xl font-medium">SecondBrain</span>
                </div>
                <div className="cursor-pointer hidden md:flex items-center gap-6">
                    <div className="hover:-translate-y-1 hover:underline hover:underline-offset-5 duration-200">
                        Features
                    </div>
                    <div className="hover:-translate-y-1 hover:underline hover:underline-offset-5 duration-200">
                        Testimonials
                    </div>
                    <div className="hover:-translate-y-1 hover:underline hover:underline-offset-5 duration-200">
                        Pricing
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div onClick={() => navigate("/signup")}>
                        <Button text="Sign up" bg_color="gold" shadow={false} fullWidth={false} size="md" />
                    </div>
                    <div onClick={() => navigate("/signin")}>
                        <Button size="md" bg_color="gold" shadow={false} fullWidth={false} text="Log in" />
                    </div>
                </div>
            </div>

            <main className="flex-grow">

                <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <h1 className="tracking-tight text-5xl sm:text-7xl md:text-8xl font-light leading-tighter">
                            Your mind deserves a second brain.
                        </h1>
                        <p className="text-xl sm:text-2xl max-w-2xl">
                            Capture ideas. Reflect on your thoughts. Learn more about yourself.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div onClick={() => navigate("/signup")}>
                                <Button text="Start for free" size="md" bg_color="gold" shadow={false} fullWidth={false} />
                            </div>
                            <div onClick={() => navigate("/dashboard")}>
                                <Button text="Take a tour" startIcon={<ArrowRight className="ml-2 h-5 w-5" />} size="lg" shadow={false} fullWidth={false} bg_color="blue" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square">
                            <img
                                src="https://imgs.search.brave.com/KUh8cjcT9DUTtfvY7OrNhrPRgwADsLGWKdPBbzexznw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE2/MzcyOTAxOC9waG90/by9wYXBlci1jcmFm/dC1icmFpbi5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9d3ZF/ZjJoZTdSSmtOcHhY/enBiUGFuUHBmSWp0/ZThtQS1feFVEUTRj/TlIyQT0"
                                alt="Second Brain Visualization"
                                width={500}
                                height={500}
                                className="rounded-2xl shadow-2xl shadow-[#DDA853]/20 animate-float"
                            />
                        </div>
                    </div>
                </section>


                <section id="features" className="bg-[#132D3C] py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light mb-4">Organize your thoughts</h2>
                            <p className="text-xl max-w-2xl mx-auto">
                                Our powerful tools help you capture, organize, and connect your ideas effortlessly.
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
                                <div
                                    key={index}
                                    className="bg-[#183B4E] p-8 rounded-xl hover:shadow-lg hover:shadow-[#DDA853]/10 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="bg-[#DDA853]/10 p-4 rounded-full w-fit mb-6">{feature.icon}</div>
                                    <h3 className="text-2xl font-medium mb-4">{feature.title}</h3>
                                    <p className="text-[#DDA853]/80">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                <section id="testimonials" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light mb-4">What our users say</h2>
                            <p className="text-xl max-w-2xl mx-auto">
                                Join thousands of thinkers, creators, and learners who've transformed their mental workspace.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    quote:
                                        "SecondBrain has completely changed how I organize my research. I can finally see connections between ideas I never noticed before.",
                                    author: "Dr. Sarah Chen",
                                    role: "Professor of Cognitive Science",
                                },
                                {
                                    quote:
                                        "As a writer, keeping track of ideas is essential. This tool has become indispensable for my creative process.",
                                    author: "James Wilson",
                                    role: "Novelist & Screenwriter",
                                },
                                {
                                    quote:
                                        "I've tried dozens of note-taking apps, but nothing compares to the intuitive design and powerful features of SecondBrain.",
                                    author: "Maya Rodriguez",
                                    role: "Product Designer",
                                },
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-[#132D3C] p-8 rounded-xl border border-[#DDA853]/20">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-[#DDA853] text-[#DDA853]" />
                                        ))}
                                    </div>
                                    <p className="italic mb-6">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-medium">{testimonial.author}</p>
                                        <p className="text-sm text-[#DDA853]/70">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                <section className="bg-[#DDA853]/10 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-light mb-6">Ready to upgrade your thinking?</h2>
                        <p className="text-xl max-w-2xl mx-auto mb-10">
                            Join thousands of users who have transformed how they capture and connect ideas. Start for free, no credit
                            card required.
                        </p>
                        <div onClick={() => navigate("/signup")}>
                            <Button text="Get started now" size="md" shadow={false} fullWidth={false} bg_color="gold" />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />                            

        </div>
    )
}
