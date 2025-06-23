import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "./Button";

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
      const response = await axios.post<QueryResponse>(
        `${BACKEND_URL}/api/v1/second-brain/query`,
        { query },
        {
          headers: {
            Authorization: localStorage.getItem("authorization") || "",
          },
        }
      );

      setResults(response.data.results || []);
    } catch (err) {
      console.error("Query failed:", err);
      toast.error("Failed to query thoughts");
    }
  }

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border w-full"
        placeholder="Ask a question..."
      />
      <Button
        bg_color="black"
        size="md"
        onClick={handleSearch}
        text="Search"
        fullWidth={false}
      />
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