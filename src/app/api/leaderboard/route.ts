import { NextResponse } from "next/server";

import { fetchTodayLeaderboard } from "@/lib/data/leaderboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await fetchTodayLeaderboard(50);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
