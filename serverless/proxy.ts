import { NextResponse } from "next/server";
import { supabaseServer } from "./lib/supabaseServer";

const ALLOWED_ORIGINS = [
   "http://localhost:5173",        
   "https://second-brainfe.vercel.app",   
 ];

export default async function proxy(req: Request) {
   const origin = req.headers.get("origin");

   // Only allow known origins
   if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new NextResponse("CORS blocked", { status: 403 });
    }

    // Handle preflight
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin ?? "",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }

   const authHeader = req.headers.get("Authorization");

   if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({
         message: "Not authorized"
      }, { status: 401 })
   }
   const token = authHeader?.split(" ")[1];

   if (!token) {
      return NextResponse.json({
         message: "No token present."
      })
   }
   const { data, error } = await supabaseServer.auth.getUser(token);

   if (error || !data.user) {
      return NextResponse.json({
         message: "Invalid token"
      }, { status: 401 })
   }

   const res = NextResponse.next();
   if (origin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Credentials", "true");
      res.headers.set("x-user-id", data.user.id);
    }

   return res;
}        
