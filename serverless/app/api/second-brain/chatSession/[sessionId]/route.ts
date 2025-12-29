import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest, { params } : {
    params: { sessionId: string }
}){
    const userId = req.headers.get("authorization");
    const sessionId = params.sessionId;
    if(!userId){
        return NextResponse.json({
            message: "user is not authenticated"
        }, { status: 401 })
    }
 
    try {
        const session = await prismaClient.chatSession.findFirst({
            where: { id: sessionId, userId },
            include: { message: { orderBy: { created_at: "asc" } } },
        });
        if (!session) {
            NextResponse.json({ message: "Session not found." }, { status: 404 });
            return;
        }
        NextResponse.json({ session }, { status: 200 });
    } catch (err) {
        NextResponse.json({ message: "Error fetching session." }, { status: 500 });
        console.error("Error is: " + err)
    }
}