import { Button } from "../components/ui/Button"

export const Signup = () => {
    return <div className="h-screen w-screen text-[#DDA853] bg-[#F5EEDC] flex justify-center pt-20  ">
        <div className="w-96 h-110 bg-[#183B4E] rounded-md p-5 pt-10">
            <div>
                <input type="text" className="w-full m-2 rounded-md "
                    placeholder="Enter the username..." />
            </div>
            <div>
                <input type="text" className="w-full m-2 rounded-md "
                    placeholder="Enter the password..." />
            </div>

            <div>
                <Button size="md" text="Signup" bg_color="gold" fullWidth={true} />
            </div>
        </div>
    </div>
} 