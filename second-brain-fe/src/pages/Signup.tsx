import { Button } from "../components/ui/Button"

export const Signup = () => {
    return <div className="h-screen w-screen bg-[#F5EEDC]">
        <div className="w-96 h-124 bg-[#183B4E] rounded-md">
            <input type="text" className="w-full m-2 rounded-md border"
                placeholder="Enter the username..." />

            <input type="text" className="w-full m-2 rounded-md border"
                placeholder="Enter the password..." />

            <Button size="md" text="Signup" bg_color="gold" fullWidth={true} />
        </div>
    </div>
} 