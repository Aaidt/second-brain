import { NextRequest, NextResponse } from "next/server";
import { qdrantClient } from "@/lib/qdrantClient";
import { getMistralEmbeddings } from "@/lib/mistralClient";
// import { genAI } from "@/lib/geminiClient";
import axios from "axios";
// import { headers } from "next/headers";

interface chatQueryResponse {
  choices: { message: { content: string } }[]
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id");
  const { query } = await req.json();
  if (!userId) {
    return NextResponse.json(
      {
        message: "user is not authenticated",
      },
      { status: 401 }
    );
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!query || typeof query !== "string" || !query.trim()) {
    return NextResponse.json(
      {
        message: "Query must be a non-empty string",
      },
      { status: 404 }
    );
  }

  try {
    const queryEmbedding = await getMistralEmbeddings(query);

    const result = await qdrantClient.search("second-brain", {
      vector: queryEmbedding,
      limit: 5,
      filter: {
        must: [{ key: "userId", match: { value: userId } }],
      },
    });

    const retrievedTexts = result
      .map((r) => `${r.payload?.title ?? ""}: ${r.payload?.thoughts ?? ""}`)
      .join("\n");
    if (!retrievedTexts) {
      return NextResponse
        .json({ 
            message: "No thoughts provided to reference an answer from."
         }, { status: 403 });
    }

    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const prompt =
      `You are a helpful assistant. The user has saved some personal notes. Use the following thoughts
          to answer their question.
          Thoughts: ${retrievedTexts}
          User question: ${query}
          Answer in a precise and clear way and refer the thoughts above only when the queries are relevant to it.
          If the queries are not relevant, answer on your own.
          `.trim();

    // const response = await model.generateContent(prompt);
    const response = await axios.post<chatQueryResponse>("https://openrouter.ai/api/v1/chat/completions", {
      model: "openrouter/auto",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        Authorization: 'Bearer ' + openRouterApiKey,
        'HTTP-Referer': 'https://second-brainfe.vercel.app', 
        'X-Title': 'Second Brain', 
      }
    });
    const text = response.data?.choices[0].message.content;

    return NextResponse.json({
      answers: text,
      references: result.map((r) => r.payload),
      title: query.length > 30 ? query.slice(0, 30) + "..." : query,
    }, { status: 200 });
  } catch (err: any) {
    console.error("Error generating answer:", err?.response?.data || err.message);
    return NextResponse.json({ message: "Error generating answer", error: err?.response?.data || err.message }, { status: 500 });
  }
}
