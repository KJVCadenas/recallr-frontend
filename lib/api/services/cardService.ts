import { Card } from "../models/types";
import { FileStorageService } from "./fileStorageService";
import { DeckService } from "./deckService";
import { randomUUID } from "crypto";

export class CardService {
  private storage = new FileStorageService();
  private deckService = new DeckService();

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    return this.storage.findMany<Card>(
      "cards.json",
      (card) => card.deckId === deckId,
    );
  }

  async getCardById(id: string): Promise<Card | null> {
    return this.storage.findById<Card>("cards.json", id);
  }

  async createCard(deckId: string, front: string, back: string): Promise<Card> {
    // Verify deck exists
    const deck = await this.deckService.getDeckById(deckId);
    if (!deck) {
      throw new Error("Deck not found");
    }

    const card: Card = {
      id: randomUUID(),
      deckId,
      front,
      back,
      createdAt: new Date().toISOString(),
    };

    await this.storage.create("cards.json", card);
    await this.deckService.updateCardCount(deckId);
    return card;
  }

  async updateCard(id: string, updates: Partial<Card>): Promise<Card | null> {
    return this.storage.update("cards.json", id, updates);
  }

  async deleteCard(id: string): Promise<boolean> {
    const card = await this.getCardById(id);
    if (!card) return false;

    const deleted = await this.storage.delete("cards.json", id);
    if (deleted) {
      await this.deckService.updateCardCount(card.deckId);
    }
    return deleted;
  }
}
