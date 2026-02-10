export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardGenerationResult {
  deck: {
    name: string;
    description: string;
  };
  cards: Flashcard[];
  warnings: string[];
}
