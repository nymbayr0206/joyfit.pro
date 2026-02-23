/**
 * Normalize Mongolian phone to 8-digit format.
 * Accepts: 99112233, +97699112233, 97699112233
 * Removes whitespace, dashes, underscores.
 * Returns null if invalid.
 */
export function normalizeMongolianPhone(input: string): string | null {
  const digitsOnly = input.replace(/[\s\-_]/g, "").replace(/\D/g, "");
  if (digitsOnly.length === 8 && /^\d{8}$/.test(digitsOnly)) return digitsOnly;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("976")) return digitsOnly.slice(3);
  return null;
}
