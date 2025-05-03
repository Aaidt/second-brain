import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from "./Button"
import axios from "axios";

interface docModal {
    open: Boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export const FileUploader = ({ open, setOpen }: docModal) => {
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
            return <p>✅ File uploaded sucessfully!!!</p>
        } else if (status === "fail") {
            return <p>❌ File upload failed!</p>
        } else if (status === "uploading") {
            return <p>⌛ File is being uploaded...</p>
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
            <div className="min-h-70 bg-[#183B4E] rounded-lg min-w-120 border-1 border-black/50 flex flex-col justify-center items-center duration-200">
            <div className="text-3xl p-5">Upload Documents</div>
                <div className=" max-w-md p-6 rounded-lg bg-[#DDA853] shadow-lg shadow-black/50 ">
                    <div className="space-y-4">
                        <label htmlFor="file" className="block text-lg font-bold text-gray-800">
                            Choose file:
                        </label>
                        <input
                            id="file"
                            type="file"
                            className="file:duration-400 file:cursor-pointer file:text-[#F5EEDC] block w-full text-md text-gray-900
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#183B4E] hover:file:bg-gray-300 
                            hover:file:text-black"
                            onChange={handleFileChange}
                        />

                        {file && (
                            <section className="p-4 bg-[#F5EEDC] rounded-lg inset-shadow-lg inset-shadow-black">
                                <h3 className="text-lg font-bold mb-2 text-gray-800">File details:</h3>
                                <ul className="text-gray-700">
                                    <li>Name: {file.name}</li>
                                    <li>Type: {file.type}</li>
                                    <li>Size: {file.size} bytes</li>
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
                                />
                            </div>
                        )}

                        <div className="text-center">
                            <Result status={status} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
