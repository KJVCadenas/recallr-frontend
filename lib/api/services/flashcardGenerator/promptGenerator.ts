import type { Flashcard } from "./types";

export interface PromptPayload {
  sourceText: string;
  maxCards: number;
}

export class PromptGenerator {
  buildFlashcardPrompt({
    sourceText,
    maxCards,
  }: PromptPayload): { system: string; user: string; schemaHint: string } {
    const schemaHint: Flashcard[] = [
      { front: "Question about concept", back: "Concise answer" },
    ];

    const system =
      "You generate study flashcards. Return only valid JSON. No markdown.";
    const user = [
      `Create up to ${maxCards} flashcards from the text below.`,
      "Return a JSON array where each item has 'front' and 'back' fields.",
      "Keep cards concise and factual.",
      "",
      "TEXT:",
      sourceText,
    ].join("\n");

    return { system, user, schemaHint: JSON.stringify(schemaHint) };
  }
}
