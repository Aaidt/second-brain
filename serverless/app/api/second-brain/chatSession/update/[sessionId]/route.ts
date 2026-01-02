import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function PUT(req: Request, { params } : {
    params: Promise<{ sessionId: string }>
}){
    const { sessionId } = await params;
    const { title } = await req.json();

    try{
        await prismaClient.chatSession.update({
            where: { id: sessionId },
            data: { title }
        })

        return NextResponse.json({ message: "Title updated successfully." }, { status: 200 })

    }catch(err){
        console.error("Error updating title: " + err)
        return NextResponse.json({ message: "Server error. Failed to update session title."}, { status: 500 })
    }
}