import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest){
    const userId = req.headers.get("authorization")
    if(!userId) {
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401})
    }

    try {
        const thoughts = await prismaClient.thought.findMany({
           where: { userId }
        });
        NextResponse.json({ thoughts }, { status: 201 });
     } catch (err) {
        NextResponse.json({ message: "Server error. Not found." }, { status: 500 })
        console.error("Error is: " + err)
     }
}