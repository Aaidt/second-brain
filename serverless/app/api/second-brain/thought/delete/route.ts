import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { qdrantClient } from "@/lib/qdrantClient";

export async function DELETE(req: NextRequest, { params } : {
    params: { thoughtId: string }
}){
    const thoughtId = params.thoughtId;
    const userId = req.headers.get("authorization")
    if(!userId) {
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401})
    }

    if (!thoughtId?.trim() || !userId) {
        return NextResponse.json({ message: "thoughtId and userId required" }, 
            { status: 401 } );
     }
  
     let deletedThought;
     try {
        deletedThought = await prismaClient.thought.findUnique({ where: { id: thoughtId } })
        if (!deletedThought || deletedThought.userId !== userId) {
            return NextResponse.json({ 
            message: "Thought not found or not authorized." }, { status: 403 })
        }
  
        await prismaClient.thought.delete({
           where: {
              id: thoughtId,
              userId: userId
           }
        })
  
        try {
           await qdrantClient.delete('second-brain', {
              points: [thoughtId]
           })
        } catch (qdrantErr) {
           // rollback the deleted thought
           await prismaClient.thought.create({
              data: {
                 id: deletedThought.id,
                 title: deletedThought.title,
                 body: deletedThought.body,
                 userId: deletedThought.userId,
                 created_at: deletedThought.created_at,
              }
           })
  
           NextResponse.json({ 
            message: "Failed to delete from Qdrant, rolled back the db." }, {
                status: 500
            })
           console.error("Qdrant deletion error: " + qdrantErr)
           return
        }
  
        NextResponse.json({ message: "Deleted successfully." }, { status: 200 })
     } catch (err) {
        console.error("Error deleting thought: ", err);
        NextResponse.json({
           message: "Server error. Failed to delete thought."
        }, { status: 500 });
     }
}
