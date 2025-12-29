import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hashLink = (len: number) => {
   const randomString = "sdajvuwrnklvuaadASUDGUABFWIONTWE"
   let hash = ""
   const length = randomString.length;
   for (let i = 0; i < len; i++) {
      hash += randomString[Math.floor((Math.random() * length))]
   }
   return hash
}

export async function POST(req: Request) {
   const { share } = await req.json();

   const userId = req.headers.get("x-user-id")
   if (!userId) {
      return NextResponse.json({
         message: "User not authorized"
      }, { status: 401 });
   }
   try {
      if (share) {
         const link = hashLink(20);
         const existingLink = await prismaClient.link.findFirst({ where: { userId } })
         if (existingLink) {
            return NextResponse.json({ link: existingLink.hash })
         }
         await prismaClient.link.create({
            data: {
               hash: link,
               user: {
                  connect: { id: userId }
               }
            }
         })
         return NextResponse.json({ link })
      } else {
         await prismaClient.link.deleteMany({
            where: { userId }
         })
         return NextResponse.json({ message: "Removed link" })
      }
   } catch (err) {
      console.error(err)
      return NextResponse.json({ message: "Server error. Could not delete." })
   }
}
