import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function DELETE(req: NextRequest, {params} : {
    params: { contentId: string }
}) {
    const contentId = await params.contentId;
    const userId = req.headers.get("authorization");

    if(!contentId?.trim() || !userId){
        NextResponse.json({ message: "Unauthorized." }, {
            status: 403
        })
        return 
    }

    if(typeof contentId !== "string"){
        NextResponse.json({
             message: "Incorrect contentId sent" }, {
                status: 403
             })
        return 
    }
    try {
        const doesUserExist = await prismaClient.user.findFirst({
            where: { id: userId }
        })
        if(!doesUserExist){
            NextResponse.json({
                 message: "This user doesnt exist." 
                }, { status: 404 });
            return
        }

        await prismaClient.content.delete({
            where: {
                id: contentId,
                userId
            }
        })
        NextResponse.json(
            { message: "Content deleted successfully." }, { status: 201 })
    } catch (err) {
        NextResponse.json({ message: "Server error. Error while deleting one." }, { status: 500 })
        console.error(err)
    }
}