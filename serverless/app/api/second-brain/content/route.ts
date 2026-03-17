import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(req: Request){
    const userId = req.headers.get("x-user-id");
    if(!userId){
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401 })
    }
    try {
        const cacheKey = `content:${userId}`;
        const cachedContent = await redis.get(cacheKey);
        console.log("cached response: ", cachedContent)

        if (cachedContent) {
            return NextResponse.json({
                content: JSON.parse(cachedContent)
            }, { status: 200 })
        }

        const content = await prismaClient.content.findMany({ where: { userId } })

        await redis.set(cacheKey, JSON.stringify(content));

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