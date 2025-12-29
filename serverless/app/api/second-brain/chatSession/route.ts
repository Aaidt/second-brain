import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("authorization");
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
    NextResponse.json({ message: "Title and userId are required." }, { status: 401 });
    return;
}

try {
    const session = await prismaClient.chatSession.create({
        data: {
            title,
            user: { connect: { id: userId } },
        },
    });
    NextResponse.json({ session }, { status: 200 });
} catch (err) {
    NextResponse.json({ message: "Error creating session." }, { status: 500 });
    console.error("Error is: " + err)
}

}