import { Navbar } from "../components/ui/Navbar"
import { Footer } from "../components/ui/Footer"

export const LandingPage = () => {
    return (
        <div className="font-serif bg-[#183B4E] min-h-screen flex flex-col justify-between">
            <Navbar />

            <main className="flex flex-col items-center justify-center flex-grow px-6 text-center duration-200">
                <h1 className="tracking-tight text-[#DDA853] text-5xl sm:text-7xl md:text-8xl font-light leading-tighter max-w-5xl mt-20 ">
                    Your mind deserves a second brain.
                </h1>

                <p className="text-[#DDA853] text-xl sm:text-2xl mt-10 max-w-3xl">
                Capture ideas. Reflect on your thoughts. <br />
                Learn more about yourself.
                </p>
            </main>

            <div className="pt-15">
                <Footer />
            </div>
        </div>
    );
}
