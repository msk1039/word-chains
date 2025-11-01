import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface WordDetail {
  id: string;
  position: number;
  word: string;
  points_awarded: number;
  multiplier_applied: number;
}

interface GameSession {
  id: string;
  score: number;
  chain_multiplier_max: number;
  words_played: number;
  submitted_at: string;
  daily_letters: {
    letter: string;
    challenge_date: string;
  } | null;
  word_details: WordDetail[];
}

async function getProfileData() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Use service role client to fetch data
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

  // Get user profile
  const { data: profile } = await serviceClient
    .from("users")
    .select("id, display_name, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  // Get user's game sessions
  const { data: sessions } = await serviceClient
    .from("game_sessions")
    .select(
      `
      id,
      score,
      chain_multiplier_max,
      words_played,
      submitted_at,
      daily_letters:daily_letter_id (
        letter,
        challenge_date
      )
    `
    )
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(20);

  // Get words for each session
  const sessionsWithWords = await Promise.all(
    (sessions || []).map(async (session: any) => {
      const { data: words } = await serviceClient
        .from("words_played")
        .select("id, position, word, points_awarded, multiplier_applied")
        .eq("session_id", session.id)
        .order("position");

      return {
        ...session,
        daily_letters: Array.isArray(session.daily_letters)
          ? session.daily_letters[0]
          : session.daily_letters,
        word_details: words || [],
      };
    })
  );

  // Calculate stats
  const stats = {
    total_games: sessions?.length || 0,
    total_score: sessions?.reduce((sum: number, s: any) => sum + (s.score || 0), 0) || 0,
    best_score: sessions?.length ? Math.max(...sessions.map((s: any) => s.score || 0)) : 0,
    best_chain: sessions?.length
      ? Math.max(...sessions.map((s: any) => s.chain_multiplier_max || 0))
      : 0,
    average_score: sessions?.length
      ? Math.round(
          sessions.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / sessions.length
        )
      : 0,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      display_name: profile?.display_name || "Player",
      avatar_url: profile?.avatar_url || null,
      created_at: profile?.created_at || user.created_at,
    },
    stats,
    sessions: sessionsWithWords as GameSession[],
  };
}

export default async function ProfilePage() {
  const data = await getProfileData();

  if (!data) {
    redirect("/login");
  }

  const { user, stats, sessions } = data;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">
          Track your progress and view your game history
        </p>
      </header>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your player information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-slate-900">{user.display_name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Games</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{stats.total_games}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Score</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-600">{stats.total_score}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Best Score</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{stats.best_score}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Best Chain</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">x{stats.best_chain}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg Score</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-700">{stats.average_score}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Games */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Recent Games</h2>
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              No games played yet. Start playing to see your history!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:border-indigo-200 transition-colors">
                <CardContent className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-50 text-2xl font-bold text-indigo-700">
                        {session.daily_letters?.letter || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          Score: {session.score} points
                        </p>
                        <p className="text-sm text-slate-500">
                          {session.words_played} words • x{session.chain_multiplier_max} best chain
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(session.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {session.word_details
                        .slice(0, 8)
                        .map((word) => (
                          <span
                            key={word.id}
                            className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                          >
                            {word.word}
                          </span>
                        ))}
                      {session.word_details.length > 8 && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          +{session.word_details.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
