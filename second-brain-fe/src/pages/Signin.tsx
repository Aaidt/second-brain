import { Button } from "../components/ui/Button"

export const Signin = () => {
    return <div className="h-screen w-screen text-[#DDA853] bg-[#F5EEDC] flex justify-center pt-20  ">
        <div className="w-96 h-100 bg-[#183B4E] rounded-md p-5 pt-25">
            <div>
                <input type="text" className="w-full rounded-md p-2 border"
                    placeholder="Enter the username..." />
            </div>
            <div>
                <input type="text" className="w-full  rounded-md p-2 border"
                    placeholder="Enter the password..." />
            </div>

            <div>
                <Button size="md" text="Signin" bg_color="gold" fullWidth={true} />
            </div>
        </div>
    </div>
} 