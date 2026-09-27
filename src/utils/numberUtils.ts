/**
 * Normalizes user number inputs from various keyboards (including Tamil digits ௦-௯,
 * full-width Unicode digits ０-９, formatted strings like +91 98401-23456) into clean ASCII digits (0-9).
 */
export function normalizeDigits(val: string): string {
  if (!val) return '';
  let str = val;

  // Tamil digits map (U+0BE6 to U+0BEF)
  const tamilDigits = ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'];
  tamilDigits.forEach((td, index) => {
    str = str.replaceAll(td, index.toString());
  });

  // Full-width digits map (U+FF10 to U+FF19)
  str = str.replace(/[\uFF10-\uFF19]/g, (char) =>
    (char.charCodeAt(0) - 0xFF10).toString()
  );

  // Strip all non-digit characters
  return str.replace(/\D/g, '');
}

/**
 * Normalizes input string allowing numbers up to maxLength
 */
export function normalizeFormattedDigits(val: string, maxLength: number = 12): string {
  if (!val) return '';
  return normalizeDigits(val).slice(0, maxLength);
}
