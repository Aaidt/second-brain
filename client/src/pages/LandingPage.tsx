import { Button } from "../components/ui/NativeButton"
import { ArrowRight, Brain, BookOpen, Lightbulb } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRef } from "react";
import { motion } from "framer-motion"
import { ModeToggle } from "@/components/ui/mode-toggle"

export function LandingPage() {
    const navigate = useNavigate();

    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const ref3 = useRef<HTMLDivElement>(null);

    const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="font-serif text-foreground/90 bg-background min-h-screen flex font-roboto flex-col justify-between">

            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="size-8 stroke-[1.5] mt-1" />
                    <span className="text-4xl font-medium font-playfair">SecondBrain</span>
                </div>
                <div className="cursor-pointer hidden md:flex items-center gap-6">
                    <div
                        onClick={() => handleScroll(ref1)}
                        className="text-md hover:-translate-y-1 hover:underline 
                     hover:underline-offset-5 duration-200 scroll-smooth ">
                        Features
                    </div>
                    <div
                        onClick={() => handleScroll(ref2)}
                        className="text-,d hover:-translate-y-1 hover:underline 
                    hover:underline-offset-5 duration-200">
                        Testimonials
                    </div>
                    <div
                        onClick={() => navigate("/pricing")}
                        className="text-md hover:-translate-y-1 hover:underline 
                    hover:underline-offset-5 duration-200">
                        Pricing
                    </div>
                </div>
                <div className="flex items-center gap-4 font-medium">
                    <div className="mt-1">
                        <ModeToggle variable="ghost" />
                    </div>
                    <div onClick={() => navigate("/signup")}>
                        <Button
                            hover={false} text="Sign up"
                            bg_color="defaultTheme" shadow={false}
                            fullWidth={false} size="sm"
                        />
                    </div>
                    <div onClick={() => navigate("/signin")}>
                        <Button
                            hover={false} size="sm"
                            bg_color="defaultTheme" shadow={false}
                            fullWidth={false} text="Log in"
                        />
                    </div>
                </div>
            </div>

            <main className="flex-grow">

                <section className="container mx-auto px-4 py-16 flex flex-col lg:flex-row justify-center items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 className="font-playfair tracking-tight text-5xl
                             sm:text-7xl md:text-8xl font-light text-center italic">
                                Your mind deserves <br /> a second brain.
                            </h1>

                            <p className="text-xl pt-5 text-center">
                                Capture ideas. Reflect on your thoughts. <br /> Learn more about yourself.
                            </p>
                        </motion.div>
                        <div className="flex flex-col justify-center sm:flex-row gap-4 pt-4">

                            <motion.div
                                initial={{ opacity: 0, x: -80 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                onClick={() => navigate("/signup")} className="">
                                <Button
                                    hover={true} text="Start for free"
                                    size="md" bg_color="defaultTheme"
                                    shadow={false}
                                    fullWidth={false}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 80 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                onClick={() => navigate("/dashboard")}>
                                <Button
                                    hover={true} text="Go to dashboard"
                                    startIcon={<ArrowRight className="ml-2 h-5 w-5" />}
                                    size="lg" shadow={false}
                                    fullWidth={false}
                                    bg_color="defaultText"
                                />
                            </motion.div>
                        </div>
                    </div>
                    {/* <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <img
                                    src="https://i.pinimg.com/736x/94/18/90/9418904b172f49551a9ee8b98f7aa8a4.jpg"
                                    alt="Second Brain Visualization"
                                    width={500}
                                    height={500}
                                    className="rounded-2xl shadow-2xl hover:shadow-black/90 duration-400 shadow-black/60 animate-float"
                                />
                            </motion.div>
                        </div>
                    </div> */}
                </section>


                <section ref={ref1} className="py-20">
                    <div className="container mx-auto px-4 py-15 border-t border-foreground/20">
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
                                    className="bg-background/95 border border-foreground/30 text-foreground p-8 rounded-xl hover:shadow-lg
                                        hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="hover:bg-foreground/30 bg-foreground/80 text-background/80 transition-colors
                                        duration-400 p-4 rounded-full w-fit mb-6">{feature.icon}</div>
                                    <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                                    <p className="">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* <section ref={ref2} className="py-8 ">
                    <div className="container mx-auto px-4 py-15 border-t border-foreground">
                        <div className="text-center mb-16">
                            <h2 id="" className="text-6xl italic font-playfair 
                            font-semibold mb-3">What our users say
                            </h2>
                            <br />
                            <p className="text-lg">
                                Join thousands of thinkers, creators, and <br />learners who've transformed their mental workspace.
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
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.2 }}
                                    className="bg-black/85 text-white p-8 rounded-xl hover:shadow-lg hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-[#DDA853] text-[#DDA853]" />
                                        ))}
                                    </div>
                                    <p className="italic mb-6">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-medium">{testimonial.author}</p>
                                        <p className="text-sm">{testimonial.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
 */}

                <section ref={ref3} className="py-10">
                    <div className="container mx-auto pb-4 text-center pt-15 border-t border-foreground/20">
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
                                onClick={() => navigate("/signup")}>
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

            {/* <Footer /> */}

        </div>
    )
}
