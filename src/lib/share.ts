import type { CardData } from './types';

/**
 * URL-safe Base64 encoding/decoding for card data.
 * Uses encodeURIComponent to handle Unicode (emoji, special chars) safely,
 * then btoa/atob for Base64, with URL-safe character replacements.
 */

export function encodeCardData(card: CardData): string {
  const json = JSON.stringify(card);
  const unicodeSafe = encodeURIComponent(json);
  const base64 = btoa(unicodeSafe);
  // Make URL-safe: + -> -, / -> _, remove padding =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeCardData(encoded: string): CardData | null {
  try {
    // Restore standard Base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Re-add padding
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const unicodeSafe = atob(base64);
    const json = decodeURIComponent(unicodeSafe);
    const data = JSON.parse(json) as CardData;
    // Basic shape validation
    if (!data || typeof data.recipientName !== 'string' || !data.exhibits) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function buildShareUrl(card: CardData): string {
  const encoded = encodeCardData(card);
  const origin = window.location.origin;
  return `${origin}/view?data=${encoded}`;
}
