import { BrainIcon } from "../icons/BrainIcon"

export function Footer (){
    return (
        <footer className=" bg-purple-700 rounded-t-xl text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <BrainIcon />
                            <span className="text-2xl font-semibold">SecondBrain</span>
                        </div>
                        <p className="">Your trusted companion for organizing thoughts and ideas.</p>
                    </div>

                    {[
                        {
                            title: "Product",
                            links: ["Features", "Pricing", "Integrations"],
                        },
                        {
                            title: "Resources",
                            links: ["Blog", "Guides", "Help Center"],
                        },
                        {
                            title: "Company",
                            links: ["About", "Careers", "Contact", "Privacy"],
                        },
                    ].map((column, index) => (
                        <div className="cursor-pointer" key={index}>
                            <h3 className="font-bold font-inter mb-4">{column.title}</h3>
                            <ul className="space-y-2 font-medium font-inter">
                                {column.links.map((link, i) => (
                                    <li key={i}>
                                        <div className="transition-colors">
                                            {link}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-black/50 mt-6 pt-6 text-center">
                    <p className="">© {new Date().getFullYear()} SecondBrain. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
