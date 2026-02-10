import { Deck, Card } from "../models/types";
import { FileStorageService } from "./fileStorageService";
import { randomUUID } from "crypto";

export class DeckService {
  private storage = new FileStorageService();

  async getDecksByUser(userId: string): Promise<Deck[]> {
    return this.storage.findMany<Deck>(
      "decks.json",
      (deck) => deck.userId === userId,
    );
  }

  async getDeckById(id: string): Promise<Deck | null> {
    return this.storage.findById<Deck>("decks.json", id);
  }

  async createDeck(
    userId: string,
    name: string,
    description: string,
  ): Promise<Deck> {
    const deck: Deck = {
      id: randomUUID(),
      name,
      description,
      userId,
      cardCount: 0,
      lastReviewed: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await this.storage.create("decks.json", deck);
    return deck;
  }

  async updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | null> {
    return this.storage.update("decks.json", id, updates);
  }

  async deleteDeck(id: string): Promise<boolean> {
    // Also delete associated cards
    const cards = await this.storage.findMany<Card>(
      "cards.json",
      (card) => card.deckId === id,
    );
    for (const card of cards) {
      await this.storage.delete("cards.json", card.id);
    }

    return this.storage.delete("decks.json", id);
  }

  async updateCardCount(deckId: string): Promise<void> {
    const cards = await this.storage.findMany<Card>(
      "cards.json",
      (card) => card.deckId === deckId,
    );
    await this.storage.update<Deck>("decks.json", deckId, {
      cardCount: cards.length,
    });
  }
}
