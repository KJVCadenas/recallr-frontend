import { z } from "zod";
import DOMPurify from "dompurify";

// Frontend validation schemas (client-side versions of backend schemas)
export const frontendLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  recaptchaToken: z.string().optional(),
});

export const frontendDeckSchema = z.object({
  name: z.string().min(1, "Deck name is required").max(100, "Deck name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less"),
});

export const frontendCardSchema = z.object({
  front: z.string().min(1, "Front side is required"),
  back: z.string().min(1, "Back side is required"),
});

export type FrontendLoginInput = z.infer<typeof frontendLoginSchema>;
export type FrontendDeckInput = z.infer<typeof frontendDeckSchema>;
export type FrontendCardInput = z.infer<typeof frontendCardSchema>;

// Sanitization functions
export function sanitizeText(text: string): string {
  // Trim whitespace and sanitize HTML
  return DOMPurify.sanitize(text.trim(), {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Validation functions that return sanitized data
export function validateAndSanitizeLogin(data: {
  email: string;
  password: string;
  recaptchaToken?: string;
}): { success: true; data: FrontendLoginInput } | { success: false; errors: string[] } {
  try {
    const sanitized = {
      email: sanitizeEmail(data.email),
      password: data.password, // Don't sanitize password as it might contain special chars
      recaptchaToken: data.recaptchaToken,
    };

    const validated = frontendLoginSchema.parse(sanitized);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map(e => e.message) };
    }
    return { success: false, errors: ["Invalid input data"] };
  }
}

export function validateAndSanitizeDeck(data: {
  name: string;
  description: string;
}): { success: true; data: FrontendDeckInput } | { success: false; errors: string[] } {
  try {
    const sanitized = {
      name: sanitizeText(data.name),
      description: sanitizeText(data.description),
    };

    const validated = frontendDeckSchema.parse(sanitized);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map(e => e.message) };
    }
    return { success: false, errors: ["Invalid deck data"] };
  }
}

export function validateAndSanitizeCard(data: {
  front: string;
  back: string;
}): { success: true; data: FrontendCardInput } | { success: false; errors: string[] } {
  try {
    const sanitized = {
      front: sanitizeText(data.front),
      back: sanitizeText(data.back),
    };

    const validated = frontendCardSchema.parse(sanitized);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map(e => e.message) };
    }
    return { success: false, errors: ["Invalid card data"] };
  }
}

export function validateAndSanitizeCards(cards: Array<{ front: string; back: string }>): {
  success: true;
  data: FrontendCardInput[];
} | { success: false; errors: string[] } {
  const errors: string[] = [];
  const validatedCards: FrontendCardInput[] = [];

  cards.forEach((card, index) => {
    const result = validateAndSanitizeCard(card);
    if (result.success) {
      validatedCards.push(result.data);
    } else {
      errors.push(`Card ${index + 1}: ${result.errors.join(", ")}`);
    }
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: validatedCards };
}