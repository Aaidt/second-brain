import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function POST(req: Request, { params }: {
    params: Promise<{ sessionId: string }>
}) {
  const userId = req.headers.get("x-user-id");
  const { sessionId } = await params;
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

    return NextResponse.json({ chats }, { status: 200 })
 } catch (err) {
    console.error('Error retrieving chats:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
 }

}