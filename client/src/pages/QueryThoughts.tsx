import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { getAccessToken, refreshAccessToken } from "../auth";

interface QueryResponse {
  results: { title: string; thoughts: string; userId: string }[];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function QueryThoughts() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResponse["results"]>([]);


  async function handleSearch() {

    if (!query.trim()) {
      toast.error("Query cannot be empty");
      return;
    }

    try {
      let token = getAccessToken();
      if (!token) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        await refreshAccessToken(BACKEND_URL).then(newToken => { token = newToken });
      }
      const response = await axios.post<QueryResponse>(`${BACKEND_URL}/second-brain/api/chatMessage/query`, { query },
        { headers: { Authorization: `Bearer ${token}` } });
      if (!response) {
        toast.error('Issue with the Backend response')
      }

      setResults(response.data.results);
    } catch (err) {
      console.error("Query failed:", err);
      toast.error("Failed to query thoughts" + err);
    }
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 justify-center items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border border-black/30 rounded-md w-full "
          placeholder="Ask a question..."
        />
        <div className="-translate-y-1">
          <Button
            bg_color="black"
            size="sm"
            onClick={handleSearch}
            text="Search"
            fullWidth={false}
          />
        </div>
      </div>
      <div className="mt-4">
        {results.map((r, idx) => (
          <div key={idx} className="border p-4 mb-2 rounded">
            <h2 className="font-bold text-xl">{r.title}</h2>
            <p>{r.thoughts}</p>
          </div>
        ))}
      </div>
    </div>
  );
}