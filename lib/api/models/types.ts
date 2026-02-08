export interface User {
  id: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  userId: string;
  cardCount: number;
  lastReviewed: Date;
  createdAt: Date;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: Date;
}

export interface AuthToken {
  userId: string;
  email: string;
  exp: number;
}
