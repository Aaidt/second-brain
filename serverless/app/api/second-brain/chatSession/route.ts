import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id");
  const { title } = await req.json();
  if (!userId) {
    return NextResponse.json(
      {
        message: "user is not authenticated",
      },
      { status: 401 }
    );
  }

  if (!title || !userId) {
    return NextResponse.json({ message: "Title and userId are required." }, { status: 401 });
}

try {
    const session = await prismaClient.chatSession.create({
        data: {
            title,
            user: { connect: { id: userId } },
        },
    });
    return NextResponse.json({ session }, { status: 200 });
} catch (err) {
    console.error("Error is: " + err)
    return NextResponse.json({ message: "Error creating session." }, { status: 500 });
}

}