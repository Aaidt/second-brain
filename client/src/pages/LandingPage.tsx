import { Navbar } from "../components/ui/Navbar"
import { Footer } from "../components/ui/Footer"

export const LandingPage = () => {
    return <div className="font-serif bg-[#183B4E] h-full">
        <div className="">
            <div className="flex justify-center pt-8">
                <Navbar />
            </div>

            <div className="hover:text-shadow-lg hover:text-shadow-black text-center text-8xl/24 font-serif font-light p-15 pt-30 tracking-tight flex justify-center items-center text-[#DDA853]">
                <h1>Store in a second brain and learn new things about yourself.</h1>
            </div>

            <div className="text-3xl font-serif flex justify-center items-center text-[#DDA853]">
                Why you need to store your memories and learn about yourself.
            </div>
        </div>

        <div className="pt-30 ">
            <Footer />
        </div>
    </div>
}