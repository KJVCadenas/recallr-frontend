import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const deckSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
});

export const cardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type DeckInput = z.infer<typeof deckSchema>;
export type CardInput = z.infer<typeof cardSchema>;
