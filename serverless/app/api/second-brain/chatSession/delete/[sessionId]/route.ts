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
        await prismaClient.chatSession.delete({ where: { id: sessionId } })
        NextResponse.json({ message: "Session deleted successfully." }, { status: 200 })
    } catch (err) {
        console.error("Error is: " + err)
        NextResponse.json({ message: "Server error. Could not delete session." }, { status: 500 })
    }
}