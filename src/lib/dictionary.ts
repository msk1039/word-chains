import { ALPHABET } from "./constants";

const API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en" as const;

const wordCache = new Map<string, boolean>();
const pendingLookups = new Map<string, Promise<boolean>>();

async function fetchWordValidity(normalizedWord: string): Promise<boolean> {
  const endpoint = `${API_BASE_URL}/${normalizedWord}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }

      throw new Error(`Dictionary lookup failed with status ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) && payload.length > 0;
  } catch (error) {
    throw new Error("Dictionary lookup failed", { cause: error });
  }
}

export async function isValidWord(word: string): Promise<boolean> {
  const normalizedWord = word.trim().toLowerCase();

  if (!normalizedWord) {
    return false;
  }

  if (wordCache.has(normalizedWord)) {
    return wordCache.get(normalizedWord) as boolean;
  }

  if (pendingLookups.has(normalizedWord)) {
    return pendingLookups.get(normalizedWord) as Promise<boolean>;
  }

  const lookupPromise = fetchWordValidity(normalizedWord)
    .then((isValid) => {
      wordCache.set(normalizedWord, isValid);
      return isValid;
    })
    .finally(() => {
      pendingLookups.delete(normalizedWord);
    });

  pendingLookups.set(normalizedWord, lookupPromise);
  return lookupPromise;
}

export function getRandomLetter(): string {
  const index = Math.floor(Math.random() * ALPHABET.length);
  return ALPHABET[index] ?? "A";
}

