import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Use service role to bypass RLS for reading daily letters
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_letters")
      .select("id, letter, challenge_date, is_active")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching daily letter:", error);
      
      // If no letter found for today, return a random one as fallback
      if (error.code === "PGRST116") {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        return NextResponse.json({
          letter: randomLetter,
          challenge_date: today,
          id: null,
          fallback: true,
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch daily letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      letter: data.letter,
      challenge_date: data.challenge_date,
      id: data.id,
      fallback: false,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
