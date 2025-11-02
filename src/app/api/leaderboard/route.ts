import { NextResponse } from "next/server";

import { fetchAllTimeLeaderboard } from "@/lib/data/leaderboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await fetchAllTimeLeaderboard(50);
    // console.log("calling all-time leaderboard API");
    // console.log("Fetched leaderboard entries:", entries.length);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
