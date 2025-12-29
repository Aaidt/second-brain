import { NextResponse, NextRequest } from "next/server";
import { prismaClient } from "@/lib/prisma"; 

export async function POST(req: Request) {
    const { title, link, type } = await req.json();
    const userId = req.headers.get("x-user-id");

    if(!userId) {
        return NextResponse.json({
            message: "User is not authorized"
        }, { status: 401 });
    }

    try {
        await prismaClient.content.create({
            data: {
                title,
                link,
                type,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        return NextResponse.json({ 
            message: "Content has been added successfully." 
        }, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ 
            message: "Server error. Content not added." 
        }, { status: 500})
    }
}