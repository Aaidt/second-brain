import { NextResponse, NextRequest } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function DELETE(req: Request){
    const userId = req.headers.get("x-user-id");
    if(!userId){
        return NextResponse.json({
            message: "user not authorized"
        }, { status: 401 })
    }
    try {
        await prismaClient.content.deleteMany({
            where: { userId }
        })
        await redis.del(`content:${userId}`);
        return NextResponse.json({
            message: "Content deleted successfully." }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Server error. Error while deleting all." }, { status: 500 })
    }
}