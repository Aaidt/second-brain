import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from "./Button"
import axios from "axios";

interface docModal {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function FileUploader({ open, setOpen }: docModal) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"initial" | "uploading" | "success" | "fail">("initial")

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setStatus("initial")
        }
    };

    const Result = ({ status }: { status: string }) => {
        if (status === "success") {
            return <p className="text-black">✅ File uploaded sucessfully!!!</p>
        } else if (status === "fail") {
            return <p className="text-black">❌ File upload failed!</p>
        } else if (status === "uploading") {
            return <p className="text-black">⌛ File is being uploaded...</p>
        }
    }


    const handleUpload = async () => {
        if (file) {
            console.log("Uploading file...")
            setStatus("uploading")

            const formData = new FormData()
            formData.append('file', file);

            try {
                const result = await axios.post(`${BACKEND_URL}/api/v1/second-brain/documents`, formData, {
                    headers: {
                        "Authorization": localStorage.getItem("authorization")
                    }
                });
                console.log("Upload successfull!!!", result.data)
                setFile(null)
                setStatus("success")
            } catch (err) {
                console.log(err);
                setStatus("fail");
            }
        }
    };

    return (open &&
        <div onClick={() => {
            setOpen(!open)
        }} className="fixed top-0 left-0 h-screen w-screen bg-black/70 z-50 flex justify-center items-center">
            <div onClick={(e) => e.stopPropagation()} className="p-5 px-6 min-h-65 bg-white pb-10 rounded-lg min-w-120 border-1
             border-black/50 flex flex-col justify-center items-center duration-200">
                <div className="text-4xl p-5 font-playfair">Upload Documents</div>
                <div className=" max-w-md p-5 rounded-lg bg-black/90 text-white shadow-lg ">
                    <div className="space-y-4">
                        <label htmlFor="file" className="block text-lg font-bold">
                            Choose file:
                        </label>
                        <input
                            id="file"
                            type="file"
                            className="file:duration-400 file:cursor-pointer file:text-black block w-full text-md text-white
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-white hover:file:bg-gray-300 
                            hover:file:text-black"
                            onChange={handleFileChange}
                        />

                        {file && (
                            <section className="p-4 bg-[#F5EEDC] rounded-lg inset-shadow-lg inset-shadow-black">
                                <h3 className="text-lg font-bold text-gray-800">File details:</h3>
                                <ul className="text-gray-700">
                                    <li>Name: {file.name}</li>
                                    <li>Type: {file.type}</li>
                                    <li>Size: {(file.size / (1024 * 1024)).toFixed(2)} Mb</li>
                                </ul>
                            </section>
                        )}

                        {file && (
                            <div className="flex justify-center">
                                <Button
                                    text="Upload a file"
                                    onClick={handleUpload}
                                    shadow={false}
                                    fullWidth={false}
                                    size="md"
                                    bg_color="blue"
                                    hover={false}
                                />
                            </div>
                        )}

                        <div className="text-center text-white">
                            <Result status={status} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
