import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function DELETE(req: Request, { params } : {
    params: Promise<{ contentId: string }>
}) {
    const { contentId } = await params;
    const userId = req.headers.get("x-user-id");

    if(!contentId?.trim() || !userId){
        return NextResponse.json({ message: "Unauthorized." }, {
            status: 403
        })
    }

    if(typeof contentId !== "string"){
        return NextResponse.json({
             message: "Incorrect contentId sent" }, {
                status: 403
             })
    }
    try {
        await prismaClient.content.delete({
            where: {
                id: contentId,
                userId
            }
        })
        await redis.del(`content:${userId}`);

        return NextResponse.json(
            { message: "Content deleted successfully." }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Server error. Error while deleting one." }, { status: 500 })
    }
}