import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { GameStatus } from "@/lib/types";

interface GameBoardProps {
  currentLetter: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  allowedLengths: number[];
  validationError: string | null;
  status: GameStatus;
  isDisabled: boolean;
  sanitizeInput: (raw: string) => string;
  isSubmitting: boolean;
}

export function GameBoard({
  currentLetter,
  inputValue,
  onInputChange,
  onSubmit,
  allowedLengths,
  validationError,
  status,
  isDisabled,
  sanitizeInput,
  isSubmitting,
}: GameBoardProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  const lengthHint =
    allowedLengths.length === 0
      ? "No valid lengths"
      : allowedLengths.length === 1
        ? `${allowedLengths[0]} letters`
        : `${allowedLengths.slice(0, -1).join(" or ")} or ${allowedLengths.at(-1)} letters`;

  return (
    <Card className="overflow-hidden border-none bg-white/70 shadow-lg">
      <CardContent className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Current Letter</p>
            <p className="text-5xl font-semibold text-indigo-600" aria-live="polite">
              {currentLetter}
            </p>
          </div>
          <Badge variant="success" className="text-sm shadow-sm">
            {status === "playing" ? "Your turn" : status === "finished" ? "Game over" : "Get ready"}
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600" htmlFor="word-input">
            Enter a word
            <Input
              id="word-input"
              value={inputValue}
              onChange={(event) => onInputChange(sanitizeInput(event.target.value))}
              placeholder={`Starts with ${currentLetter}`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={isDisabled || isSubmitting}
              aria-invalid={Boolean(validationError)}
              aria-describedby="word-error word-hint"
              aria-busy={isSubmitting}
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p id="word-hint" className="text-sm text-slate-500">
              Next word: {lengthHint}
            </p>
            <Button type="submit" disabled={isDisabled || isSubmitting} className="sm:w-auto">
              {isSubmitting ? "Checking..." : "Submit word"}
            </Button>
          </div>
          {validationError ? (
            <p
              id="word-error"
              className="rounded-md border border-rose-100 bg-rose-50/90 px-3 py-2 text-sm text-rose-600"
              role="alert"
            >
              {validationError}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
