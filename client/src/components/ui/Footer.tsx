export const Footer = () => {
    return (
        <footer className="bg-[#DDA853] text-[#183B4E] py-10 px-6 shadow-inner">
            <div className="max-w-5xl mx-auto">
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-lg font-semibold">
                    <li className="hover:underline hover:underline-offset-4 hover:-translate-y-1 transition duration-200">About</li>
                    <li className="hover:underline hover:underline-offset-4 hover:-translate-y-1 transition duration-200">Contact Us</li>
                    <li className="hover:underline hover:underline-offset-4 hover:-translate-y-1 transition duration-200">Signin</li>
                    <li className="hover:underline hover:underline-offset-4 hover:-translate-y-1 transition duration-200">Signup</li>
                </ul>
            </div>
        </footer>
    );
}
