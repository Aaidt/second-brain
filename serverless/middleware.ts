import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseServer } from "./lib/supabaseServer";

export default async function middleware(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if(!authHeader?.startsWith("Bearer ")){
        return NextResponse.json({
            error: "Not authorized"
        }, { status: 401 })
    }
    const token = authHeader?.split(" ")[1];

    if(!token){
        return NextResponse.json({
            error: "No token present."
        })
    }
    const { data, error } = await supabaseServer.auth.getUser(token); 

    if(error || !data.user) {
        return NextResponse.json({
            error: "Invalid token"
        }, { status: 401 })
    }

    const res = NextResponse.next();
    res.headers.set("x-user-id", data.user.id);
    
    return res;
}        