import { useState } from "react";
import { toast } from "react-toastify"
import { Button } from "../components/ui/Button"
import axios from "axios";

interface axiosResponse {
    answers: string,
    references: { payload: string }[]
}

export function Chat() {
    const [query, setQuery] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [references, setReferences] = useState<any[]>([]);

    async function handleChatQuery() {
        setLoading(true);
        const response = await axios.post<axiosResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/second-brain/chat-query`, {
            query
        }, {
            headers: {
                Authorization: localStorage.getItem("authorization")
            }
        });
        if (!response) {
            toast.error('Issue with the Backend response')
        }
        setAnswer(response.data?.answers);
        setReferences(response.data?.references);
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-center items-center gap-2">
                < input
                    className="p-2 rounded-md border border-black/30 w-full text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask your second brain anything..."
                />
                <div className="-translate-y-1">
                    <Button
                        onClick={handleChatQuery}
                        bg_color="black"
                        text={loading ? "Thinking..." : "Ask"}
                        size="md"
                        fullWidth={false}
                    />
                </div>
            </div>


            {answer && (
                <div className="mt-6 bg-white shadow p-4 rounded">
                    <h2 className="text-xl font-semibold">Answer</h2>
                    <p className="mt-2 whitespace-pre-wrap">{answer}</p>
                </div>
            )}

            {references.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Sources from your thoughts:</h3>
                    {references.map((r, idx) => (
                        <div key={idx} className="p-3 border rounded mb-2">
                            <strong>{r.title}</strong>
                            <p className="text-sm">{r.thoughts}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
