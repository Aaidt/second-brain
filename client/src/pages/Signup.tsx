// import { Button } from "../components/ui/Button"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { motion } from "framer-motion"
import axios from "axios";
import { CloseBarIcon } from "@/components/icons/CloseBarIcon";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface ResponseDataType {
    error: string
}

const initial = { opacity: 0 }
const whileInView = { opacity: 1 }
const viewport = { once: true }
const transition = { duration: 0.6 }

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false)

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        setLoading(true)
        try {
            await axios.post<ResponseDataType>(`${BACKEND_URL}/api/v1/second-brain/signup`, {
                username,
                password
            });
            toast.success("You have successfully signed-up!!!!✅");
            navigate("/signin");
            setLoading(false)
        } catch (err) {
            toast.error("Something went wrong. Please try again.❌")
            console.log(err)
            setLoading(false)
        }
    }

    return <div className="h-screen w-screen text-white/80 bg-black/90 flex justify-center items-center">
        <span onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white fixed top-0 left-0 p-8 cursor-pointer hover:-translate-x-1 duration-200 transition-all">
            <CloseBarIcon />
        </span>
        <motion.div
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
            transition={transition}
        >
            <div className="p-6 m-2 w-88 bg-white/90 text-black rounded-lg">
                <div className="text-4xl font-bold pb-2 flex justify-center">
                    Sign-up
                </div>
                <div className="text-md text-gray-600 mb-3 text-center">
                    Enter your information to create an account
                </div>
                <label htmlFor="username" className="font-semibold "> Username:
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                passwordRef.current?.focus();
                            }
                        }}
                        id="username" ref={usernameRef}
                        className="border font-normal w-full border-black/40 px-2 py-1 rounded-md mb-2"
                        type="text" placeholder="exapmle@gmail.com" disabled={loading} />
                </label>

                <label htmlFor="password" className="font-semibold "> Password:
                    <input
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                await signup()
                            }
                        }}
                        id="password" type="password" ref={passwordRef}
                        className="border font-normal w-full border-black/40 px-2 py-1 mb-2 rounded-md"
                        placeholder="********" disabled={loading} />
                </label>

                <div className="pt-3 flex justify-center items-center">

                    <button className="w-full bg-black/90 rounded-md text-white text-lg
                font-semibold px-4 hover:bg-black/75 duration-300 transition-all py-1"
                        onClick={() => signup()} disabled={loading}>
                        {loading ? "Processing..." : "Sign-up"}
                    </button>

                </div>

                <div className="flex justify-center pt-2">
                    If you already have an account....
                    <div className="font-bold hover:underline hover:-translate-y-1 duration-200 hover:underline-offset-4 cursor-pointer"
                        onClick={() => navigate("/signin")}>
                        Sign-in
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
} 
