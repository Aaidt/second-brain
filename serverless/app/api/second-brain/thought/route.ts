import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest){
    const userId = req.headers.get("x-user-id")
    if(!userId) {
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401})
    }

    try {
        const thoughts = await prismaClient.thought.findMany({
           where: { userId }
        });
        return NextResponse.json({ thoughts }, { status: 201 });
     } catch (err) {
        console.error("Error is: " + err)
        return NextResponse.json({ message: "Server error. Not found." }, { status: 500 })
     }
}