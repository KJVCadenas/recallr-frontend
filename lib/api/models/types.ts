export interface User {
  id: string;
  email: string;
  username?: string; // Optional username field
  password: string; // hashed
  isAdmin?: boolean;
  createdAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  userId: string;
  cardCount: number;
  lastReviewed: string;
  createdAt: string;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
}

export interface AuthToken {
  userId: string;
  email: string;
  isAdmin?: boolean;
  exp: number;
}
