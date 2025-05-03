import { useState } from 'react';
import { Button } from "./Button"
import axios from "axios";

export const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            console.log("Uploading file...")

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
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F5EEDC] flex flex-col justify-center items-center">
            <div className="max-w-140 p-4 rounded-lg flex flex-col items-center mb-1 bg-[#DDA853]">
                <input id="file" type="file" className="font-semibold flex justify-center items-center" onChange={handleFileChange} />
            </div>
            {file && (
                <section className="font-semibold flex justify-center items-center flex-col p-2">
                    File details:
                    <ul className="">
                        <li>Name: {file.name}</li>
                        <li>Type: {file.type}</li>
                        <li>Size: {file.size} bytes</li>
                    </ul>
                </section>
            )}

            {file && (
                <div className="mt-1 flex justify-center items-center">
                    <Button
                        text="Upload a file"
                        onClick={handleUpload}
                        shadow={false}
                        fullWidth={false}
                        size="md"
                        bg_color="gold"
                    />
                </div>
            )}

        </div>
    );
};
