import { Button } from "../components/ui/Button"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


export const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const signup = async () => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        await axios.post(`${BACKEND_URL}/api/v1/second-brain/signup`, {
            username,
            password
        });
        alert("You have successfully signed-up!!!!");
        navigate("/signin");
    }

    return <div className="h-screen w-screen text-[#DDA853] bg-[#F5EEDC] flex justify-center items-center">
        <div className="w-96 h-85 bg-[#183B4E] rounded-md p-5 ">
            <div className="text-4xl flex justify-center items-center pt-5 pb-10 font-bold">
                Sign-up
            </div>
            <div className="pr-2 pl-2">
                <input ref={usernameRef} type="text" className="w-full rounded-md p-2 border"
                    placeholder="Enter the username..." />
            </div>
            <div className="pt-4 pr-2 pl-2">
                <input ref={passwordRef} type="text" className="w-full  rounded-md p-2 border"
                    placeholder="Enter the password..." />
            </div>

            <div className="pr-3 font-bold">
                <Button size="md" text="Signup" bg_color="gold" fullWidth={true} onClick={() => signup()} />
            </div>
            <div className="flex justify-center">
                If you already have an account....
                <div className="hover:underline hover:-translate-y-1 duration-200 hover:underline-offset-4 cursor-pointer"
                onClick={() => navigate("/signin")}>
                    Sign-in
                </div>
            </div>
        </div>
    </div>
} 