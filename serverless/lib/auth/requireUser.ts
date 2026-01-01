import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabaseServer";

export async function requireUser(req: Request){
    let user = null;
    let error = null;

    // 1. Try Bearer Token
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const res = await supabaseServer.auth.getUser(token);
        user = res.data.user;
        error = res.error;
    } 
    
    // 2. Fallback to Cookies if no token
    if (!user) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const cookieStore = await cookies()
    
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set(name, value, options)
            },
            remove(name: string, options: any) {
              cookieStore.set(name, "", options)
            }
          }
        })
        const res = await supabase.auth.getUser()
        user = res.data.user;
        error = res.error;
    }

    if (error || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    

    const dbUser = await prismaClient.user.upsert({
        where: { id: user.id },
        update: {
          username: user.user_metadata?.full_name ?? null,
          photo: user.user_metadata?.avatar_url ?? null,
        },
        create: {
          id: user.id,
          email: user.email!, 
          username: user.user_metadata?.name ?? null,
          photo: user.user_metadata?.avatar_url ?? null,
        }
    })
    
    return { authUser: user, dbUser }
}