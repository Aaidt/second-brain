import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { getMistralEmbeddings } from "@/lib/mistralClient";
import { qdrantClient } from "@/lib/qdrantClient";

export async function POST(req: NextRequest){
    const { title, thoughts } = await req.json();
    const userId = req.headers.get("authorization")
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

         NextResponse.json({
            message: "No vector embeddings processed."
         }, { status: 401 });
         return
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

         NextResponse.json({
             message: "Successfully added the thought." },
            { status: 201 })
      } catch (qdrantErr) {
         console.error("Error while inserting in qdrant db is: " + qdrantErr);
         // rollack db insert
         await prismaClient.thought.delete({ where: { id: saved.id } });
         NextResponse.json({ message: "Failed to upsert thought to Qdrant DB. Had to rollback. " },
            { status: 500 }
         )
      }

   } catch (err) {
      console.error("Error is: " + err)
      NextResponse.json({ 
        message: "Content not added. Something went wrong" }, { status: 500 })
   }
}