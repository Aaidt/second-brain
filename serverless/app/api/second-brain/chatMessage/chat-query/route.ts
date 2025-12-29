import { NextRequest, NextResponse } from "next/server";
import { qdrantClient } from "@/lib/qdrantClient";
import { getMistralEmbeddings } from "@/lib/mistralClient";
import { genAI } from "@/lib/geminiClient";

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt =
      `You are a helpful assistant. The user has saved some personal notes. Use the following thoughts
          to answer their question.
          Thoughts: ${retrievedTexts}
          User question: ${query}
          Answer in a precise and clear way and refer the thoughts above only when the queries are relevant to it.
          If the queries are not relevant, answer on your own.
          `.trim();

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    return NextResponse.json({
      answers: text,
      references: result.map((r) => r.payload),
      title: query.length > 30 ? query.slice(0, 30) + "..." : query,
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error generating answer" }, { status: 500 });
  }
}
