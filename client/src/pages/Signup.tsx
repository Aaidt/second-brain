import { Button } from "../components/ui/Button"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface ResponseDataType {
    error: string
}

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

    return <div className="h-screen w-screen text-white/80 bg-purple-500  flex justify-center items-center">
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

            <div className="pr-3 font-bold text-lg">
                <Button
                    loading={loading}
                    hover={true} shadow={false}
                    size="md" text="Signup"
                    bg_color="black" fullWidth={true}
                    onClick={() => signup()}
                />
            </div>
            <div className="flex justify-center pt-1">
                If you already have an account....
                <div className="font-bold hover:underline hover:-translate-y-1 duration-200 hover:underline-offset-4 cursor-pointer"
                    onClick={() => navigate("/signin")}>
                    Sign-in
                </div>
            </div>
        </div>
    </div>
} 
