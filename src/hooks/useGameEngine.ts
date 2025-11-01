"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { INITIAL_TIME_SECONDS, MAX_WORD_LENGTH } from "@/lib/constants";
import { getRandomLetter, isValidWord } from "@/lib/dictionary";
import { calculateScore, getValidLengths, validateWord } from "@/lib/gameLogic";
import type { GameState, PlayedWord, ValidationResult } from "@/lib/types";

interface UseGameEngineResult {
  state: GameState;
  inputValue: string;
  setInputValue: (value: string) => void;
  submitWord: () => Promise<void>;
  restartGame: () => void;
  validationError: string | null;
  allowedLengths: number[];
  isWordUsed: (word: string) => boolean;
  sanitizeInput: (raw: string) => string;
  isSubmitting: boolean;
}

const createInitialState = (startingLetter: string): GameState => ({
  currentLetter: startingLetter,
  wordChain: [],
  score: 0,
  timeRemaining: INITIAL_TIME_SECONDS,
  gameStatus: "playing",
  lastWordLength: 0,
  chainMultiplier: 0,
  bestChainMultiplier: 0,
});

const createPlayedWord = (
  value: string,
  pointsAwarded: number,
  multiplierApplied: number,
): PlayedWord => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${value}-${Date.now()}`,
  value,
  pointsAwarded,
  length: value.length,
  multiplierApplied,
  createdAt: Date.now(),
});

export function useGameEngine(): UseGameEngineResult {
  const [state, setState] = useState<GameState>(() => createInitialState(getRandomLetter()));
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usedWordsRef = useRef<Set<string>>(new Set());

  const allowedLengths = useMemo(() => getValidLengths(state.lastWordLength), [state.lastWordLength]);

  const sanitizeInput = useCallback((raw: string) => {
    const onlyLetters = raw.replace(/[^a-zA-Z]/g, "");
    return onlyLetters.slice(0, MAX_WORD_LENGTH).toUpperCase();
  }, []);

  const startGame = useCallback(() => {
    const letter = getRandomLetter();
    usedWordsRef.current = new Set();
    setState(createInitialState(letter));
    setInputValue("");
    setValidationError(null);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (state.gameStatus !== "playing") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((previous) => {
        if (previous.gameStatus !== "playing") {
          return previous;
        }

        if (previous.timeRemaining <= 1) {
          return {
            ...previous,
            timeRemaining: 0,
            gameStatus: "finished",
            chainMultiplier: 0,
          };
        }

        return {
          ...previous,
          timeRemaining: previous.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.gameStatus]);

  useEffect(() => {
    if (state.timeRemaining === 0 && state.gameStatus === "playing") {
      setState((previous) => ({
        ...previous,
        gameStatus: "finished",
        chainMultiplier: 0,
      }));
    }
  }, [state.timeRemaining, state.gameStatus]);

  const submitWord = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    if (state.gameStatus !== "playing") {
      setValidationError("The round has finished");
      return;
    }

    const candidate = inputValue.trim().toLowerCase();

    if (!candidate) {
      setValidationError("Enter a word to continue");
      return;
    }

    if (usedWordsRef.current.has(candidate)) {
      setValidationError("Word already used");
      return;
    }

    const validation: ValidationResult = validateWord(
      candidate,
      state.currentLetter,
      state.lastWordLength,
    );

    if (!validation.valid) {
      setValidationError(validation.error ?? "Invalid word");
      return;
    }

    setIsSubmitting(true);

    try {
      const dictionaryResult = await isValidWord(candidate);

      if (!dictionaryResult) {
        setValidationError("Word not recognized");
        return;
      }

      const nextLetter = candidate.charAt(candidate.length - 1).toUpperCase();

      usedWordsRef.current.add(candidate);
      setValidationError(null);
      setInputValue("");

      setState((previous) => {
        const points = calculateScore(candidate.length, previous.chainMultiplier);
        const updatedMultiplier = previous.chainMultiplier + 1;
        const entry = createPlayedWord(candidate, points, updatedMultiplier);

        return {
          ...previous,
          currentLetter: nextLetter,
          wordChain: [...previous.wordChain, entry],
          score: previous.score + points,
          lastWordLength: candidate.length,
          chainMultiplier: updatedMultiplier,
          bestChainMultiplier: Math.max(previous.bestChainMultiplier, updatedMultiplier),
        };
      });
    } catch {
      setValidationError("Unable to verify word. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [inputValue, isSubmitting, state]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const isWordUsed = useCallback((word: string) => usedWordsRef.current.has(word.toLowerCase()), []);

  return {
    state,
    inputValue,
    setInputValue,
    submitWord,
    restartGame,
    validationError,
    allowedLengths,
    isWordUsed,
    sanitizeInput,
    isSubmitting,
  };
}
