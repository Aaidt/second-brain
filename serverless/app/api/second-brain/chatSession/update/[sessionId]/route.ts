import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest, { params } : {
    params: { sessionId: string }
}){
    const sessionId = params.sessionId;
    const { title } = await req.json();

    try{
        await prismaClient.chatSession.update({
            where: { id: sessionId },
            data: { title }
        })

        NextResponse.json({ message: "Title updated successfully." }, { status: 200 })

    }catch(err){
        console.error("Error updating title: " + err)
        NextResponse.json({ message: "Server error. Failed to update session title."}, { status: 500 })
    }
}