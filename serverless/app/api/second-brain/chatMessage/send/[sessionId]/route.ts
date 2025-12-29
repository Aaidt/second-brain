import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: { sessionId: string };
  }
) {
  const userId = req.headers.get("authorization");
  const sessionId = params.sessionId;
  const { sender, content } = await req.json();
  if (!userId) {
    return NextResponse.json(
      {
        message: "user is not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    await prismaClient.chatMessage.create({
      data: {
        sender,
        content,
        session: {
          connect: { id: sessionId },
        },
      },
    });
    NextResponse.json(
      {
        message: "Messages sent successfully!!!",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error while saving chats. " + err);
    NextResponse.json(
      {
        message: "Server error. Error while saving messages.",
      },
      { status: 500 }
    );
  }
}
