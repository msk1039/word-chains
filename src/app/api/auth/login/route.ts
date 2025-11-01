import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase credentials missing" }, { status: 500 });
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        cookieStore.delete({ name, ...options });
        response.cookies.delete({ name, ...options });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });

  if (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (!data.session) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }

  // Ensure user profile exists in custom users table
  if (data.user) {
    const { error: profileError } = await supabase.from("users").upsert(
      {
        id: data.user.id,
        display_name: data.user.user_metadata?.display_name || null,
        is_anonymous: false,
      },
      {
        onConflict: "id",
        ignoreDuplicates: false,
      }
    );

    if (profileError) {
      console.error("Profile sync error:", profileError);
      // Don't fail login if profile sync fails
    }
  }

  return response;
}
