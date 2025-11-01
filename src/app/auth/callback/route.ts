import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // The user is now verified and logged in.
      // Supabase has automatically added them to the auth.users table.
      console.log("User verified:", data.user.id, data.user.email);

      // Now, add the user to the custom public.users table if they aren't there already.
      if (!supabaseServiceKey) {
        console.error(
          "DEBUG: SUPABASE_SERVICE_ROLE_KEY is missing. The admin client cannot be created, so the custom users table will not be updated."
        );
      } else {
        console.log("DEBUG: Service key found. Creating Supabase admin client.");
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // Check if user already exists in the custom users table
        console.log("DEBUG: Checking if user exists in public.users table for id:", data.user.id);
        const { data: existingUser, error: checkError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (checkError) {
          console.error(
            "DEBUG: Error checking for existing user in public.users:",
            checkError
          );
        }

        // If the user doesn't exist in public.users, insert them.
        if (!existingUser) {
          console.log(
            "DEBUG: User does not exist in public.users. Attempting to insert.",
            { id: data.user.id, email: data.user.email }
          );
          const { error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
              id: data.user.id,
              display_name: data.user.user_metadata?.display_name || null,
              email: data.user.email,
              // You can add more fields here if needed, like display_name
              // display_name: data.user.user_metadata?.display_name || null,
              is_anonymous: false,
            });

          if (insertError) {
            console.error(
              "DEBUG: Failed to insert user into public.users:",
              insertError
            );
          } else {
            console.log(
              "DEBUG: Successfully added user to custom public.users table."
            );
          }
        } else {
          console.log("DEBUG: User already exists in custom public.users table. No action taken.");
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error("Error exchanging code for session:", error);
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
