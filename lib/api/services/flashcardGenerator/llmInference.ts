import type { Flashcard } from "./types";
import { PromptGenerator } from "./promptGenerator";

export interface LlmInferenceResult {
  cards: Flashcard[];
  warnings: string[];
}

const DEFAULT_MAX_CARDS = 20;

export class LlmInference {
  private promptGenerator: PromptGenerator;

  constructor(promptGenerator = new PromptGenerator()) {
    this.promptGenerator = promptGenerator;
  }

  async generateFlashcardsWithOpenRouter(
    sourceText: string,
    maxCards = DEFAULT_MAX_CARDS,
  ): Promise<LlmInferenceResult> {
    const warnings: string[] = [];
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      warnings.push("OPENROUTER_API_KEY is not configured.");
      return { cards: [], warnings };
    }

    const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
    const { system, user } = this.promptGenerator.buildFlashcardPrompt({
      sourceText,
      maxCards,
    });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.2,
        }),
      },
    );

    if (!response.ok) {
      warnings.push(`OpenRouter request failed with status ${response.status}.`);
      return { cards: [], warnings };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      warnings.push("OpenRouter response was empty.");
      return { cards: [], warnings };
    }

    try {
      const parsed = JSON.parse(content) as Flashcard[];
      if (!Array.isArray(parsed)) {
        warnings.push("OpenRouter response was not an array.");
        return { cards: [], warnings };
      }
      return { cards: parsed, warnings };
    } catch (error) {
      console.error("Failed to parse OpenRouter response:", error);
      warnings.push("Failed to parse OpenRouter response as JSON.");
      return { cards: [], warnings };
    }
  }
}

export class MockLlmInference {
  async generateFlashcardsWithOpenRouter(
    sourceText: string,
  ): Promise<LlmInferenceResult> {
    const trimmed = sourceText.trim();
    if (!trimmed) {
      return { cards: [], warnings: ["No content provided for mock generation."] };
    }

    const preview = trimmed.split(/\s+/).slice(0, 20).join(" ");

    return {
      cards: [
        {
          front: "What is the main topic of the uploaded text?",
          back: preview || "No content available.",
        },
        {
          front: "List one key term from the document.",
          back: trimmed.split(/\s+/)[0] || "N/A",
        },
      ],
      warnings: ["Mock LLM mode enabled. Using placeholder flashcards."],
    };
  }
}
