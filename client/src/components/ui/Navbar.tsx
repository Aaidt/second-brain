import { Brain } from "lucide-react"
import { useNavigate } from "react-router-dom"


export function Navbar () {
    const navigate = useNavigate();
    return (
        <nav className="flex items-center justify-between px-8 py-7 text-[#DDA853]">
            <div className="flex items-center gap-3">
                <Brain />
                <div className="font-light text-4xl leading-10">
                    Second Brain
                </div>
            </div>

            <div className="flex tracking-wide gap-6 text-xl font-light">
                <div className="cursor-pointer hover:underline hover:underline-offset-5 hover:-translate-y-1 transition duration-300"
                    onClick={() => navigate("/signup")}>Register</div>

                <div className="cursor-pointer hover:underline hover:underline-offset-5 hover:-translate-y-1 transition duration-300"
                    onClick={() => navigate("/signin")}>Login</div>
            </div>
        </nav>
    );
}
