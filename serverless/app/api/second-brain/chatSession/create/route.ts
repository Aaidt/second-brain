import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest){
    const userId = req.headers.get("authorization");
    if(!userId){
        return NextResponse.json({
            message: "user is not authenticated"
        }, { status: 401 })
    }
        
    try {
        const sessions = await prismaClient.chatSession.findMany({
            where: { userId },
            orderBy: { created_at: "desc" },
            take: 15
        });
        NextResponse.json({ sessions }, { status: 201 });
    } catch (err) {
        NextResponse.json({ message: "Error fetching sessions." }, { status: 500 });
        console.error("Error is: " + err)
    }
}