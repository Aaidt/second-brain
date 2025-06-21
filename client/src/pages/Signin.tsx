import { Button } from "../components/ui/Button"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate();

    type LoginResponse = {
        token: string
    }

    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        setLoading(true)
        try {
            const response = await axios.post<LoginResponse>(`${BACKEND_URL}/api/v1/second-brain/signin`, {
                username,
                password
            });
            const jwt = response.data.token as string
            localStorage.setItem("authorization", jwt)
            toast.success("You have successfully signed-in!!!!✅");
            navigate("/dashboard");
            setLoading(false)
        } catch (err) {
            toast.error("Something went wrong. Please try again.❌")
            setLoading(false)
            console.log(err)
        }

    }


    return <div className="h-screen w-screen text-black bg-purple-500 flex justify-center items-center">
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

            <label htmlFor="password" className="font-semibold "> Password:
                <input
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            await signin()
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
                    size="md" text="Signin"
                    bg_color="black"
                    fullWidth={true}
                    onClick={() => signin()}
                />
            </div>
            <div className="flex justify-center pt-1">
                If you dont have an account....
                <div className="font-bold hover:underline hover:-translate-y-1 duration-200 hover:underline-offset-4 cursor-pointer"
                    onClick={() => navigate("/signup")}>
                    Sign-up
                </div>
            </div>
        </div>
    </div>
} 
