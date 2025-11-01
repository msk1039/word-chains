"use client";

import { GameBoard } from "@/components/game-board";
import { GameHeader } from "@/components/game-header";
import { GameOver } from "@/components/game-over";
import { WordChain } from "@/components/word-chain";
import { useGameEngine } from "@/hooks/useGameEngine";

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
  } = useGameEngine();

  return (
    <main className="relative flex min-h-screen items-start justify-center bg-linear-to-br from-slate-100 via-white to-indigo-100 py-12 px-4">
      <div className="relative z-10 w-full max-w-5xl space-y-6">
        <GameHeader
          timeRemaining={state.timeRemaining}
          score={state.score}
          chainMultiplier={state.chainMultiplier}
          bestChainMultiplier={state.bestChainMultiplier}
          status={state.gameStatus}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
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
            />

            {state.gameStatus === "finished" ? (
              <GameOver
                score={state.score}
                wordsPlayed={state.wordChain.length}
                bestChainMultiplier={state.bestChainMultiplier}
                onRestart={restartGame}
              />
            ) : null}
          </div>

          <WordChain words={state.wordChain} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(14,116,144,0.12),transparent_55%)]" />
      </div>
    </main>
  );
}
