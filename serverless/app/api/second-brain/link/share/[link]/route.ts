import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function POST({ params }: { params: { link: string } }
) {

   const link = params.link;

   try {
      if (!link) {
         NextResponse.json({ message: "Link is required." })
         return
      }

      const hashLink = await prismaClient.link.findFirst({
         where: { hash: link }
      })
      if (!hashLink) {
         NextResponse.json({ message: "Invalid link." })
         return
      }

      const content = await prismaClient.content.findMany({
         where: { userId: hashLink.userId }
      })

      const thought = await prismaClient.thought.findMany({
         where: { userId: hashLink.userId }
      })

      const user = await prismaClient.user.findFirst({
         where: { id: hashLink.userId }
      })
      if (!user) {
         NextResponse.json({
            message: "User not found."
         })
      }

      NextResponse.json({
         username: user?.username,
         content,
         thought
      })
   } catch (err) {
      NextResponse.json({ message: "Server error. Error in the sharing process." })
      console.error(err)
   }
}
