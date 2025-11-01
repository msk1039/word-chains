"use client";

import { GameBoard } from "@/components/game-board";
import { GameOver } from "@/components/game-over";
import { WordChain } from "@/components/word-chain";
import { useGameEngine } from "@/hooks/useGameEngine";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {
    state,
    inputValue,
    setInputValue,
    submitWord,
    restartGame,
    validationError,
    allowedLengths,
    sanitizeInput,
    isSubmitting,
    startGame,
  } = useGameEngine();

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-start justify-center bg-background p-4 sm:p-6 lg:p-12">
      <div className="relative z-10 w-full max-w-lg space-y-4">
        {/* Timer and Score - Top Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 inline-flex items-center gap-3 rounded-2xl border-2 border-border bg-muted px-6 py-4 shadow-lg ring-2 ring-ring/10">
            <div className={state.gameStatus === "playing" ? "h-3 w-3 rounded-full bg-primary animate-pulse ring-4 ring-primary/20" : "h-3 w-3 rounded-full bg-muted-foreground/30"} />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Time Left</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatTime(state.timeRemaining)}
              </p>
            </div>
          </div>
          <div className="flex-1 inline-flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-accent px-6 py-4 shadow-lg ring-2 ring-primary/20">
            <div className="flex-1 text-right">
              <p className="text-xs font-medium text-accent-foreground/70">Score</p>
              <p className="text-2xl font-bold text-accent-foreground tabular-nums">
                {state.score}
              </p>
            </div>
          </div>
        </div>

        {/* Main Game Card or Game Over */}
        {state.gameStatus === "finished" ? (
          <div className="rounded-2xl border-2 border-border bg-muted p-1 shadow-2xl ring-4 ring-ring/10">
            <GameOver
              score={state.score}
              wordsPlayed={state.wordChain.length}
              bestChainMultiplier={state.bestChainMultiplier}
              onRestart={restartGame}
            />
          </div>
        ) : (
          <div className="relative rounded-2xl border-2 border-primary/20 bg-card p-1 shadow-2xl ring-4 ring-primary/10 backdrop-blur-sm">
            <GameBoard
              currentLetter={state.currentLetter}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={submitWord}
              allowedLengths={allowedLengths}
              validationError={validationError}
              status={state.gameStatus}
              isDisabled={state.gameStatus !== "playing"}
              sanitizeInput={sanitizeInput}
              isSubmitting={isSubmitting}
              chainMultiplier={state.chainMultiplier}
            />
            
            {/* Start Game Overlay */}
            {state.gameStatus === "idle" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl backdrop-blur-md bg-muted/60">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="h-16 px-12 text-xl font-bold shadow-2xl ring-4 ring-primary/20 hover:ring-primary/30"
                >
                  Start Game
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Word Chain History */}
        <div className="rounded-2xl border-2 border-border bg-muted/50 p-1 shadow-xl ring-2 ring-ring/10 backdrop-blur-sm">
          <WordChain words={state.wordChain} />
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top gradient orb */}
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        {/* Bottom gradient orb */}
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        {/* Side accent */}
        <div className="absolute top-1/2 -left-32 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>
    </main>
  );
}
