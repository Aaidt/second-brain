import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { ChevronsLeft, Eye, EyeOff  } from "lucide-react";
import { SigninFunction } from "../auth";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const initial = { opacity: 0 }
const whileInView = { opacity: 1 }
const viewport = { once: true }
const transition = { duration: 0.6 }

export function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [hidden, setHidden] = useState<boolean>(false)

    const navigate = useNavigate();

    async function handleSignin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if(!username || !password){
            toast.error("Username or password fields cannot be empty.")
            return 
        }

        setLoading(true)
        try {
            await SigninFunction({
                username: username!,
                password: password!,
                url: `${BACKEND_URL}/second-brain/api/auth/signin`
            });
            toast.success("You have successfully signed-in!!!!");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Something went wrong. Please try again.")
            console.log(err)
        } finally {
            setLoading(false)
        }

    }


    return <div className="h-screen w-screen text-black/90 bg-black/95 flex justify-center items-center">
        <span onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white fixed top-0 left-0 p-8 cursor-pointer hover:-translate-x-1 duration-200 transition-all">
            <ChevronsLeft />
        </span>
        <motion.div
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
            transition={transition}
        >
            <div className="p-6 m-2 w-88 bg-white/90 rounded-lg">
                <div className="text-4xl flex justify-center items-center pb-2 font-bold">
                    Sign-in
                </div>
                <div className="text-md text-gray-600 mb-3 text-center">
                    Enter your credentials to access the account
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

                <label htmlFor="password" className="font-semibold"> Password:
                    <div className="relative">
                        {hidden ? (
                        <EyeOff
                            onClick={() => setHidden(false)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                            tabIndex={0}
                            aria-label="Show password"
                        />
                        ) : (
                        <Eye
                            onClick={() => setHidden(true)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                            tabIndex={0}
                            aria-label="Hide password"
                        />
                        )}
                        <input
                            onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                await handleSignin();
                                }
                            }}
                            id="password"
                            type={hidden ? "password" : "text"}
                            ref={passwordRef}
                            className="border font-normal w-full border-black/40 px-2 pr-10 py-1 mb-2 rounded-md"
                            placeholder="********"
                            disabled={loading}
                            />
                    </div>
                </label>

                <div className="pt-3 flex justify-center items-center">

                    <button className="w-full bg-black/90 rounded-md text-white text-lg
                font-semibold px-4 hover:bg-black/75 duration-300 transition-all py-1"
                        onClick={() => handleSignin()} disabled={loading}>
                        {loading ? "Processing..." : "Sign-in"}
                    </button>

                </div>

                <div className="flex justify-center pt-2">
                    If you dont have an account....
                    <div className="font-bold hover:underline hover:-translate-y-1 duration-200 hover:underline-offset-4 cursor-pointer"
                        onClick={() => navigate("/signup")}>
                        Sign-up
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
} 
