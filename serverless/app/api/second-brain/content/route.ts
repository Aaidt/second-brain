import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: Request){
    const userId = req.headers.get("x-user-id");
    if(!userId){
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401 })
    }
    try {
        const content = await prismaClient.content.findMany({ where: { userId } })

        return NextResponse.json({ content }, { 
            status: 200
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ 
            message: "Server error. Could not get content." },
        { status: 500 })
    }
}