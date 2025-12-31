import { NextResponse } from "next/server";
import { supabaseServer } from "./lib/supabaseServer";

export default async function proxy(req: Request) {
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
   res.headers.set("x-user-id", data.user.id);

   return res;
}        
