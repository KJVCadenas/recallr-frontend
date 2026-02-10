export interface TextValidationResult {
  ok: boolean;
  sanitizedText: string;
  errors: string[];
  warnings: string[];
}

const MAX_TEXT_CHARS = 120000;

export function validateImportText(text: unknown): TextValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof text !== "string") {
    return {
      ok: false,
      sanitizedText: "",
      errors: ["Text is required."],
      warnings,
    };
  }

  let sanitized = text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!sanitized) {
    errors.push("Text is empty.");
  }

  if (sanitized.length > MAX_TEXT_CHARS) {
    sanitized = sanitized.slice(0, MAX_TEXT_CHARS);
    warnings.push("Text was truncated to fit size limits.");
  }

  return {
    ok: errors.length === 0,
    sanitizedText: sanitized,
    errors,
    warnings,
  };
}
