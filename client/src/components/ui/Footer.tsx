import { Brain } from "lucide-react"

export const Footer = () => {
    return (
        <footer className="bg-[#132D3C] py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="h-6 w-6" />
                            <span className="text-lg font-medium">SecondBrain</span>
                        </div>
                        <p className="text-[#DDA853]/70">Your trusted companion for organizing thoughts and ideas.</p>
                    </div>

                    {[
                        {
                            title: "Product",
                            links: ["Features", "Pricing", "Integrations", "Roadmap"],
                        },
                        {
                            title: "Resources",
                            links: ["Blog", "Guides", "Help Center", "API"],
                        },
                        {
                            title: "Company",
                            links: ["About", "Careers", "Contact", "Privacy"],
                        },
                    ].map((column, index) => (
                        <div className="cursor-pointer" key={index}>
                            <h3 className="font-medium mb-4">{column.title}</h3>
                            <ul className="space-y-2">
                                {column.links.map((link, i) => (
                                    <li key={i}>
                                        <div className="text-[#DDA853]/70 hover:text-[#DDA853] transition-colors">
                                            {link}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[#DDA853]/20 mt-12 pt-8 text-center text-[#DDA853]/70">
                    <p>© {new Date().getFullYear()} SecondBrain. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
