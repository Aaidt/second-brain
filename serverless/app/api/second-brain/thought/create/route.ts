import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { getMistralEmbeddings } from "@/lib/mistralClient";
import { qdrantClient } from "@/lib/qdrantClient";

export async function POST(req: Request){
    const { title, thoughts } = await req.json();
    const userId = req.headers.get("x-user-id")
    if(!userId) {
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401})
    }

    const fullText = `${title} ${thoughts}`

   if (!title || !thoughts || !userId) {
    return NextResponse.json({ message: "Title, thoughts, and userId are required" }, 
        { status: 400 }
    );
   }

   let saved;
   try {
      saved = await prismaClient.thought.create({
         data: {
            title: title,
            body: thoughts,
            user: {
               connect: { id: userId }
            },
            created_at: new Date()
         }
      });

      const vector = await getMistralEmbeddings(fullText)
      console.log("length: " + vector?.length)
      if (!vector) {
         // rollback the Db insert.
         await prismaClient.thought.delete({ where: { id: saved.id } })

         return NextResponse.json({
            message: "No vector embeddings processed."
         }, { status: 401 });
      }

      try {

         await qdrantClient.upsert('second-brain', {
            points: [
               {
                  id: saved.id,
                  vector,
                  payload: {
                     title,
                     thoughts,
                     userId
                  }
               }
            ]
         })

         return NextResponse.json({
             message: "Successfully added the thought." },
            { status: 201 })
      } catch (qdrantErr) {
         console.error("Error while inserting in qdrant db is: " + qdrantErr);
         // rollack db insert
         await prismaClient.thought.delete({ where: { id: saved.id } });
         return NextResponse.json({ message: "Failed to upsert thought to Qdrant DB. Had to rollback. " },
            { status: 500 }
         )
      }

   } catch (err) {
      console.error("Error is: " + err)
      return NextResponse.json({ 
        message: "Content not added. Something went wrong" }, { status: 500 })
   }
}