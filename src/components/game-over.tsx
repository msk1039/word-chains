import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Zap } from "lucide-react";

interface GameOverProps {
  score: number;
  wordsPlayed: number;
  bestChainMultiplier: number;
  onRestart: () => void;
}

export function GameOver({ score, wordsPlayed, bestChainMultiplier, onRestart }: GameOverProps) {
  return (
    <Card className="border-2 border-border bg-card/95 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold text-foreground">Game Over!</CardTitle>
        <CardDescription className="text-muted-foreground">Great job on your word chain!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Final Score
            </p>
            <p className="text-6xl font-bold text-primary">{score}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">Words Played</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{wordsPlayed}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">Best Chain</p>
              </div>
              <p className="mt-1 text-2xl font-bold text-primary">x{(1 + bestChainMultiplier * 0.5).toFixed(1)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRestart} size="lg" className="w-full">
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
}
