import { Button } from "../components/ui/Button"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    type LoginResponse = {
        token: String
    }

    const signin = async () => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const response = await axios.post<LoginResponse>(`${BACKEND_URL}/api/v1/second-brain/signin`, {
            username,
            password
        });
        const jwt = response.data.token as string
        localStorage.setItem("authorization", jwt)
        alert("You have successfully signed-in!!!!");
        navigate("/dashboard");
    }


    return <div className="h-screen w-screen text-[#DDA853] bg-[#F5EEDC] flex justify-center items-center">
        <div className="w-96 h-75 bg-[#183B4E] rounded-md p-5">
            <div className="text-4xl flex justify-center items-center  pb-5 font-bold">
                Sign-in
            </div>
            <div className="pl-2 pr-1">
                <input ref={usernameRef} type="text" className="w-full rounded-md p-2 border"
                    placeholder="Username..." />
            </div>
            <div className="pt-4 pl-2 pr-1">
                <input ref={passwordRef} type="text" className="w-full  rounded-md p-2 border"
                    placeholder="Password..." />
            </div>

            <div className="pr-3 font-bold text-lg">
                <Button size="md" text="Signin" bg_color="gold" fullWidth={true} onClick={() => signin()} />
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