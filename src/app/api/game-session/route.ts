import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Supabase credentials missing" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      score,
      chain_multiplier_max,
      total_words,
      daily_letter_id,
      words_played,
    } = body;

    // Validate required fields
    if (
      typeof score !== "number" ||
      typeof chain_multiplier_max !== "number" ||
      typeof total_words !== "number" ||
      !Array.isArray(words_played)
    ) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    if (!daily_letter_id) {
      return NextResponse.json(
        { error: "daily_letter_id is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // Get user from auth session
    const authClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    });

    const {
      data: { user },
    } = await authClient.auth.getUser();

    // Only save sessions for authenticated users
    if (!user) {
      return NextResponse.json(
        { error: "Must be logged in to save game sessions" },
        { status: 401 }
      );
    }

    // Use service role client to insert game session (bypasses RLS)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Insert game session
    const { data: session, error: sessionError } = await serviceClient
      .from("game_sessions")
      .insert({
        user_id: user.id,
        daily_letter_id,
        score,
        chain_multiplier_max,
        words_played: total_words,
        duration_seconds: 90,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Error creating game session:", sessionError);
      return NextResponse.json(
        { error: "Failed to save game session", details: sessionError.message },
        { status: 500 }
      );
    }

    // Insert words played
    if (words_played.length > 0) {
      const wordsToInsert = words_played.map((word: any, index: number) => ({
        session_id: session.id,
        position: index + 1,
        word: word.value,
        points_awarded: word.pointsAwarded,
        multiplier_applied: word.multiplierApplied,
      }));

      const { error: wordsError } = await serviceClient
        .from("words_played")
        .insert(wordsToInsert);

      if (wordsError) {
        console.error("Error saving words played:", wordsError);
        // Don't fail the whole request if words fail to save
      }
    }

    return NextResponse.json({
      success: true,
      session_id: session.id,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
