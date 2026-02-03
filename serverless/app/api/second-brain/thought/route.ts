import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest){
    const userId = req.headers.get("x-user-id")
    if(!userId) {
        return NextResponse.json({
            message: "user is not authorized"
        }, { status: 401})
    }

    try {
        const cacheKey = `thoughts:${userId}`;
        const cachedThoughts = await redis.get(cacheKey);

        if (cachedThoughts) {
             return NextResponse.json({
                 thoughts: JSON.parse(cachedThoughts)
             }, { status: 200 })
        }

        const thoughts = await prismaClient.thought.findMany({
           where: { userId }
        });

        await redis.set(cacheKey, JSON.stringify(thoughts));

        return NextResponse.json({ thoughts }, { status: 201 });
     } catch (err) {
        console.error("Error is: " + err)
        return NextResponse.json({ message: "Server error. Not found." }, { status: 500 })
     }
}