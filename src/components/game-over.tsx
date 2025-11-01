import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface GameOverProps {
  score: number;
  wordsPlayed: number;
  bestChainMultiplier: number;
  onRestart: () => void;
}

export function GameOver({ score, wordsPlayed, bestChainMultiplier, onRestart }: GameOverProps) {
  const bestMultiplierDisplay = (bestChainMultiplier > 0 ? 1 + bestChainMultiplier * 0.5 : 1).toFixed(1);

  return (
    <Card className="border-none bg-white/80 shadow-2xl">
      <CardHeader>
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Time's up!</h2>
          <p className="text-sm text-slate-500">Great run. Ready for another round?</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-indigo-500">Final score</p>
            <p className="text-2xl font-semibold text-indigo-700">{score}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Words played</p>
            <p className="text-2xl font-semibold text-slate-900">{wordsPlayed}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-emerald-500">Best chain</p>
            <p className="text-2xl font-semibold text-emerald-600">x{bestMultiplierDisplay}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onRestart} size="lg">
          Play again
        </Button>
      </CardFooter>
    </Card>
  );
}
