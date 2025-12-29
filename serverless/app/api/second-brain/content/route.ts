import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest){
    const userId = req.headers.get("authorization");
    if(!userId){
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401 })
    }
    try {
        const content = await prismaClient.content.findMany({ where: { userId } })

        NextResponse.json({content }, { 
            status: 200
        })
    } catch (err) {
        NextResponse.json({ 
            message: "Server error. Could not get content." },
        { status: 500 })
        console.error(err)
    }
}