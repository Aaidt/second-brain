import { NextRequest, NextResponse } from "next/server";
import { qdrantClient } from "@/lib/qdrantClient";
import { getMistralEmbeddings } from "@/lib/mistralClient";

export async function POST(req: NextRequest){
    const userId = req.headers.get("authorization");
    const { query } = await req.json()
    if(!userId){
        return NextResponse.json({
            message: "user is not authenticated"
        }, { status: 401 })
    }

    if (!query || typeof query !== "string" || !query.trim()) {
        NextResponse.json({ 
            message: "Query must be a non-empty string" }
        , { status: 403  })
        return
     }
     if (!userId) {
        NextResponse.json({ 
            message: "User is not authenticated." }, { status: 401 })
        return
     }
  
     try {
        const queryEmbedding = await getMistralEmbeddings(query)
        if (!queryEmbedding) {
           NextResponse.json({
             message: "Failed to generate query embedding" }
            , { status: 403 });
           return
        }
  
        const result = await qdrantClient.search("second-brain", {
           vector: queryEmbedding,
           limit: 5,
           filter: {
              must: [
                 { key: "userId", match: { value: userId } }
              ]
           }
        })
  
        // console.log(result.score);
  
        const results = result.map(r => r.payload)
        NextResponse.json({ results }, { status: 201 })
  
     } catch (err) {
        NextResponse.json({ 
            message: "Server error. Error saving thoughts" 
        }, { status: 500 })
        console.error("Error is: " + err)
     }
}