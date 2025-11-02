import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  best_score: number;
  best_chain: number;
  total_games: number;
  last_played: string;
}

export interface TodayLeaderboardEntry {
  user_id: string;
  display_name: string;
  letter: string;
  challenge_date: string;
  best_score: number;
  best_chain: number;
  games_today: number;
  last_played: string;
}

export async function fetchAllTimeLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  // Use service role to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase
    .from("all_time_leaderboard")
    .select("*")
    .limit(limit);
  
  if (error || !data) {
    console.error("Unable to fetch all-time leaderboard", error);
    return [];
  }

  return data as LeaderboardEntry[];
}

export async function fetchTodayLeaderboard(limit = 50): Promise<TodayLeaderboardEntry[]> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase
    .from("today_leaderboard")
    .select("*")
    .limit(limit);

  if (error || !data) {
    console.error("Unable to fetch today's leaderboard", error);
    return [];
  }

  return data as TodayLeaderboardEntry[];
}
