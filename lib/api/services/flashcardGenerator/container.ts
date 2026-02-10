import { FlashcardGenerator } from "./FlashcardGenerator";
import { LlmInference, MockLlmInference } from "./llmInference";
import { OutputFormatter } from "./outputFormatter";
import { PromptGenerator } from "./promptGenerator";

export function createFlashcardGenerator() {
  const llmMode = process.env.FLASHCARD_LLM_MODE?.toLowerCase() || "mock";
  console.log(`Using LLM mode: ${llmMode}`);
  const promptGenerator = new PromptGenerator();
  const llmInference =
    llmMode === "mock"
      ? new MockLlmInference()
      : new LlmInference(promptGenerator);
  const outputFormatter = new OutputFormatter();

  return new FlashcardGenerator(llmInference, outputFormatter);
}
