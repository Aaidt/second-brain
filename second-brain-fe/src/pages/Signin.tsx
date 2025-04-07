import { Button } from "../components/ui/Button"

export const Signin = () => {

    const signin = () => {
        
    }


    return <div className="h-screen w-screen text-[#DDA853] bg-[#F5EEDC] flex justify-center items-center">
        <div className="w-96 h-90 bg-[#183B4E] rounded-md p-5 ">
            <div className="text-4xl flex justify-center items-center pt-5 pb-15 font-bold">
                Sign-in
            </div>
            <div className="pr-2 pl-2">
                <input type="text" className="w-full rounded-md p-2 border"
                    placeholder="Enter the username..." />
            </div>
            <div className="pt-4 pr-2 pl-2">
                <input type="text" className="w-full  rounded-md p-2 border"
                    placeholder="Enter the password..." />
            </div>

            <div className="pr-3">
                <Button size="md" text="Signin" bg_color="gold" fullWidth={true} onClick={() => signin()} />
            </div>
        </div>
    </div>
} 