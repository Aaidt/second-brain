import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
    });
}

export async function POST(req: Request) {
    const user = await requireUser(req);

    if (user instanceof NextResponse) {
        return user;
    }

    return NextResponse.json({
        message: "User synced successfully",
        user: user.dbUser
    }, {
        headers: {
            "Access-Control-Allow-Origin": "*", 
        }
    });
}
