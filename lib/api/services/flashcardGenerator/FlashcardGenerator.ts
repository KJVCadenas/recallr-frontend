import { OutputFormatter } from "./outputFormatter";
import type { FlashcardGenerationResult } from "./types";

export class FlashcardGenerator {
  private llmInference: {
    generateFlashcardsWithOpenRouter: (
      sourceText: string,
      maxCards?: number,
    ) => Promise<{ cards: { front: string; back: string }[]; warnings: string[] }>;
  };
  private outputFormatter: OutputFormatter;

  constructor(
    llmInference: {
      generateFlashcardsWithOpenRouter: (
        sourceText: string,
        maxCards?: number,
      ) => Promise<{ cards: { front: string; back: string }[]; warnings: string[] }>;
    },
    outputFormatter = new OutputFormatter(),
  ) {
    this.llmInference = llmInference;
    this.outputFormatter = outputFormatter;
  }

  async generateFromText({
    text,
    name,
    description,
  }: {
    text: string;
    name?: string;
    description?: string;
    userId?: string;
  }): Promise<FlashcardGenerationResult> {
    const warnings: string[] = [];

    const { cards: llmCards, warnings: llmWarnings } =
      await this.llmInference.generateFlashcardsWithOpenRouter(text);
    warnings.push(...llmWarnings);

    const { cards, warnings: formatWarnings } =
      this.outputFormatter.normalizeFlashcards(llmCards);
    warnings.push(...formatWarnings);

    return {
      deck: {
        name: name || "Untitled Deck",
        description: description || "",
      },
      cards,
      warnings,
    };
  }
}
