import { useState } from 'react';
import { Button } from "./Button"
import axios from "axios";

export const FileUploader = () => {
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

    return (
        <div className="min-h-screen bg-[#F5EEDC] flex flex-col justify-center items-center duration-200">
            <div className="w-full max-w-md p-6 rounded-lg bg-[#DDA853] shadow-lg shadow-black/50 ">
                <div className="space-y-4">
                    <label htmlFor="file" className="block text-lg font-bold text-gray-800">
                        Choose file:
                    </label>
                    <input
                        id="file"
                        type="file"
                        className="block w-full text-md text-gray-900
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#F5EEDC] file:text-gray-800
                            hover:file:bg-gray-800 hover:file:text-[#F5EEDC]"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <section className="p-4 bg-[#F5EEDC] rounded-lg inset-shadow-black/40">
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
    );
};
