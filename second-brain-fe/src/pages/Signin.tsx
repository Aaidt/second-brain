import { Button } from "../components/ui/Button"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    type LoginResponse = {
        token: String
    }

    const signin = async() => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const response = await axios.post<LoginResponse>(`${BACKEND_URL}/api/v1/brain/signin`, {
            username,
            password
        });
        const jwt = response.data.token as string
        localStorage.setItem("token", jwt)
        alert("You have successfully signed-in!!!!");
        navigate("/Dashboard");
    }


    return <div className="h-screen w-screen text-[#DDA853] bg-[#F5EEDC] flex justify-center items-center">
        <div className="w-96 h-90 bg-[#183B4E] rounded-md p-5 ">
            <div className="text-4xl flex justify-center items-center pt-5 pb-15 font-bold">
                Sign-in
            </div>
            <div className="pr-2 pl-2">
                <input ref={usernameRef} type="text" className="w-full rounded-md p-2 border"
                    placeholder="Enter the username..." />
            </div>
            <div className="pt-4 pr-2 pl-2">
                <input ref={passwordRef} type="text" className="w-full  rounded-md p-2 border"
                    placeholder="Enter the password..." />
            </div>

            <div className="pr-3">
                <Button size="md" text="Signin" bg_color="gold" fullWidth={true} onClick={() => signin()} />
            </div>
        </div>
    </div>
} 