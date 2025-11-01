import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user profile from custom users table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, display_name, avatar_url, created_at")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    // Get user's game sessions with words
    const { data: sessions, error: sessionsError } = await supabase
      .from("game_sessions")
      .select(
        `
        id,
        score,
        chain_multiplier_max,
        total_words,
        submitted_at,
        daily_letters:daily_letter_id (
          letter,
          challenge_date
        ),
        words_played (
          id,
          position,
          word,
          points_awarded,
          multiplier_applied,
          played_at
        )
      `
      )
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(20);

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError);
    }

    // Calculate stats
    const stats = {
      total_games: sessions?.length || 0,
      total_score: sessions?.reduce((sum, s) => sum + (s.score || 0), 0) || 0,
      best_score: sessions?.length
        ? Math.max(...sessions.map((s) => s.score || 0))
        : 0,
      best_chain: sessions?.length
        ? Math.max(...sessions.map((s) => s.chain_multiplier_max || 0))
        : 0,
      average_score: sessions?.length
        ? Math.round(
            sessions.reduce((sum, s) => sum + (s.score || 0), 0) /
              sessions.length
          )
        : 0,
    };

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: profile?.display_name || null,
        avatar_url: profile?.avatar_url || null,
        created_at: profile?.created_at || user.created_at,
      },
      stats,
      sessions: sessions || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { display_name, avatar_url } = body;

    // Update profile
    const { error: updateError } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        display_name: display_name || null,
        avatar_url: avatar_url || null,
      });

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
