import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "../components/ui/NativeButton";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface QueryResponse {
  results: { title: string; thoughts: string; userId: string }[];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function QueryThoughts() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResponse["results"]>([]);
  const [session, setSession] = useState<Session | null>(null);

  supabase.auth.getSession().then(({data: {session}}) => {
    setSession(session);
  });
  const token = session?.access_token;

  async function handleSearch() {

    if (!query.trim()) {
      toast.error("Query cannot be empty");
      return;
    }

    try {
      const response = await axios.post<QueryResponse>(`${BACKEND_URL}/second-brain/api/chatMessage/query`, { query },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
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