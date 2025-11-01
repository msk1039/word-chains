import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";
import type { GameStatus } from "@/lib/types";

interface GameHeaderProps {
  timeRemaining: number;
  score: number;
  chainMultiplier: number;
  bestChainMultiplier: number;
  status: GameStatus;
}

export function GameHeader({
  timeRemaining,
  score,
  chainMultiplier,
  bestChainMultiplier,
  status,
}: GameHeaderProps) {
  const multiplierDisplay = (chainMultiplier > 0 ? 1 + chainMultiplier * 0.5 : 1).toFixed(1);
  const bestMultiplierDisplay = (bestChainMultiplier > 0 ? 1 + bestChainMultiplier * 0.5 : 1).toFixed(1);

  return (
    <header className="flex flex-col gap-4 rounded-lg border border-indigo-100 bg-indigo-50/80 p-6 shadow-inner md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Badge className="text-sm" variant="secondary">
          {status === "playing" ? "Live" : status === "finished" ? "Finished" : "Ready"}
        </Badge>
        <p className="text-2xl font-semibold text-slate-900">
          {formatTime(timeRemaining)}
          <span className="ml-2 text-sm font-normal text-slate-500">remaining</span>
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 text-slate-900 sm:grid-cols-3">
        <div className="rounded-lg bg-white/80 p-4 text-center shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Score</p>
          <p className="text-2xl font-semibold text-slate-900">{score}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-4 text-center shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Chain</p>
          <p className="text-2xl font-semibold text-indigo-600">x{multiplierDisplay}</p>
        </div>
        <div className="rounded-lg bg-white/80 p-4 text-center shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Best Chain</p>
          <p className="text-2xl font-semibold text-emerald-600">x{bestMultiplierDisplay}</p>
        </div>
      </div>
    </header>
  );
}
