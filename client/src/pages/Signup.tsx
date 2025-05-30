import { Button } from "../components/ui/Button"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface ResponseDataType {
    error: string
}

export const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const signup = async () => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        try {
            await axios.post<ResponseDataType>(`${BACKEND_URL}/api/v1/second-brain/signup`, {
                username,
                password
            });
            alert("You have successfully signed-up!!!!✅✅");
            navigate("/signin");

        } catch (err: any) {
            alert("Something went wrong. Please try again.❌❌")
            console.log(err)
        }
    }

    return <div className="h-screen w-screen text-white/90 bg-[#F5EEDC] flex justify-center items-center">
        <div className="w-96 h-75 bg-[#4B3F2F] rounded-md p-5 ">
            <div className="text-4xl flex justify-center items-center pb-5 font-bold">
                Sign-up
            </div>
            <div className="pr-1 pl-2">
                <input ref={usernameRef} type="text" className="w-full rounded-md p-2 border"
                    placeholder="Username..." />
            </div>
            <div className="pt-4 pr-1 pl-2">
                <input ref={passwordRef} type="text" className="w-full  rounded-md p-2 border"
                    placeholder="Password..." />
            </div>

            <div className="pr-3 font-bold text-lg">
                <Button hover={true} shadow={false} size="md" text="Signup" bg_color="gold" fullWidth={true} onClick={() => signup()} />
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
