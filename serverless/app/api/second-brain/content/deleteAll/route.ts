import { NextResponse, NextRequest } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function DELETE(req: NextRequest){
    const userId = req.headers.get("authorization");
    if(!userId){
        return NextResponse.json({
            message: "user not authorized"
        }, { status: 401 })
    }
    try {
        await prismaClient.content.deleteMany({
            where: { userId }
        })
        NextResponse.json({
            message: "Content deleted successfully." }, { status: 201 })
    } catch (err) {
        NextResponse.json({ message: "Server error. Error while deleting all." }, { status: 500 })
        console.error(err)
    }
}