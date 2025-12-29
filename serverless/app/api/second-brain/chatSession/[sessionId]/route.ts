import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: Request, { params } : {
    params: Promise<{ sessionId: string }>
}){
    const userId = req.headers.get("x-user-id");
    const { sessionId } = await params;
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
            return NextResponse.json({ message: "Session not found." }, { status: 404 });
        }
        return NextResponse.json({ session }, { status: 200 });
    } catch (err) {
        console.error("Error is: " + err)
        return NextResponse.json({ message: "Error fetching session." }, { status: 500 });
    }
}