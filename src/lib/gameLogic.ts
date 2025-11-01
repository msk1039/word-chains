import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "./constants";
import { ValidationResult } from "./types";

export function validateWord(
  word: string,
  currentLetter: string,
  lastWordLength: number,
): ValidationResult {
  const candidate = word.trim().toLowerCase();

  if (!candidate) {
    return {
      valid: false,
      error: "Enter a word to continue",
    };
  }

  if (candidate.length < MIN_WORD_LENGTH) {
    return {
      valid: false,
      error: `Word must be at least ${MIN_WORD_LENGTH} letters`,
    };
  }

  if (candidate.length > MAX_WORD_LENGTH) {
    return {
      valid: false,
      error: `Word must be ${MAX_WORD_LENGTH} letters or fewer`,
    };
  }

  if (!candidate.startsWith(currentLetter.toLowerCase())) {
    return {
      valid: false,
      error: `Word must start with ${currentLetter.toUpperCase()}`,
    };
  }

  if (lastWordLength >= MIN_WORD_LENGTH) {
    const allowedLengths = getValidLengths(lastWordLength);

    if (!allowedLengths.includes(candidate.length)) {
      const readableLengths = allowedLengths.join(" or ");
      return {
        valid: false,
        error: `Word must be ${readableLengths} letters`,
      };
    }
  }

  return { valid: true };
}

export function calculateScore(wordLength: number, chainMultiplier: number): number {
  const basePoints = wordLength * 10;
  const multiplier = 1 + chainMultiplier * 0.5;
  return Math.round(basePoints * multiplier);
}

export function getValidLengths(lastWordLength: number): number[] {
  if (lastWordLength < MIN_WORD_LENGTH) {
    return [MIN_WORD_LENGTH, MIN_WORD_LENGTH + 1];
  }

  const options = new Set<number>();
  const smaller = lastWordLength - 1;
  const larger = lastWordLength + 1;

  if (smaller >= MIN_WORD_LENGTH) {
    options.add(smaller);
  }

  if (larger <= MAX_WORD_LENGTH) {
    options.add(larger);
  }

  return Array.from(options).sort((a, b) => a - b);
}
