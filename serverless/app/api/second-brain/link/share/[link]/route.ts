import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function POST(req: Request, { params }: { params: Promise<{ link: string }> }
) {
   const { link } = await params;

   try {
      if (!link) {
         return NextResponse.json({ message: "Link is required." })
      }

      const cacheKey = `share:${link}`;
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
         return NextResponse.json(JSON.parse(cachedData));
      }

      const hashLink = await prismaClient.link.findFirst({
         where: { hash: link }
      })
      if (!hashLink) {
         return NextResponse.json({ message: "Invalid link." })
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
         return NextResponse.json({
            message: "User not found."
         })
      }

      const responseData = {
         username: user?.username,
         content,
         thought
      };

      await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60);

      return NextResponse.json(responseData)
   } catch (err) {
      console.error(err)
      return NextResponse.json({ message: "Server error. Error in the sharing process." })
   }
}
