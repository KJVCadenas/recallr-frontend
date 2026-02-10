import type { Flashcard } from "./types";

export interface OutputFormattingResult {
  cards: Flashcard[];
  warnings: string[];
}

export class OutputFormatter {
  normalizeFlashcards(cards: Flashcard[]): OutputFormattingResult {
    const warnings: string[] = [];

    const normalized = cards
      .filter((card) => card && card.front && card.back)
      .map((card) => ({
        front: card.front.trim(),
        back: card.back.trim(),
      }))
      .filter((card) => card.front.length > 0 && card.back.length > 0);

    if (normalized.length === 0 && cards.length > 0) {
      warnings.push("All generated cards were empty after normalization.");
    }

    const unique = new Map<string, Flashcard>();
    normalized.forEach((card) => {
      const key = `${card.front.toLowerCase()}::${card.back.toLowerCase()}`;
      if (!unique.has(key)) {
        unique.set(key, card);
      }
    });

    return { cards: Array.from(unique.values()), warnings };
  }
}
