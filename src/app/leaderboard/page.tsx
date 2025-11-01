import { fetchTodayLeaderboard } from "@/lib/data/leaderboard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const entries = await fetchTodayLeaderboard();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Today&apos;s Leaderboard</h1>
          <p className="text-sm text-slate-600">
            Best scores from today&apos;s challenge. Each player&apos;s highest score is shown.
          </p>
        </div>
        <form>
          <Button type="submit" variant="outline">
            Refresh
          </Button>
        </form>
      </header>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm">
        <table className="min-w-full table-fixed border-collapse">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 w-16">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3 w-28">Best Score</th>
              <th className="px-4 py-3 w-28">Best Chain</th>
              <th className="px-4 py-3 w-28">Games Today</th>
              <th className="px-4 py-3 w-40">Last Played</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No results yet. Be the first to play today!
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr key={entry.user_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-600">#{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {entry.display_name || "Player"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{entry.best_score}</td>
                  <td className="px-4 py-3 text-amber-600 font-medium">x{entry.best_chain}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.games_today}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(entry.last_played).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
