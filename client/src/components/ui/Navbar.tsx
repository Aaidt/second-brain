import { BrainIcon } from "../icons/BrainIcon"


export const Navbar = () => {
    return <div className="flex justify-center justify-between p-2 bg-[#DDA853] text-[#183B4E] rounded-full w-180 h-18 shadow-xl shadow-gray-800 border-b-black border-r-black">
        <div className="flex pr-70">
            <div className="pl-1 p-1">
                <BrainIcon />
            </div>
            <div className="p-2 font-semibold flex justify-center items-center pb-2 text-xl">
                Second <br /> Brain
            </div>
        </div>

        <div className="flex p-4 pl-30">
            <div className="font-light text-xl pr-8">
                Login
            </div>
            <div className="font-light text-xl ">
                Signup
            </div>
        </div>
    </div>
}