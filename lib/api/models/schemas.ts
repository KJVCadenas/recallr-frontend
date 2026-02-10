import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  recaptchaToken: z.string(),
});

export const deckSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
});

export const cardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
