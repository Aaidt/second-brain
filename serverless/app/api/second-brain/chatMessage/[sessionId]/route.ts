import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: {
    params: { sessionId: string }
}) {
  const userId = req.headers.get("authorization");
    const sessionId = params.sessionId;
  if (!userId) {
    return NextResponse.json(
      {
        message: "user is not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const chats = await prismaClient.chatMessage.findMany({
       where: { sessionId }
    })

    NextResponse.json({ chats }, { status: 200 })
 } catch (err) {
    console.error('Error retrieving chats:', err);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
 }

}