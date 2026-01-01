import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: Request){
    const userId = req.headers.get("x-user-id");
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
        return NextResponse.json({ sessions }, { status: 201 });
    } catch (err) {
        console.error("Error is: " + err)
        return NextResponse.json({ message: "Error fetching sessions." }, { status: 500 });
    }
}