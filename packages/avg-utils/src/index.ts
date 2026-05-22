/**
 * @avg/utils - Shared utility functions for AVG Codex Lab
 *
 * This package eliminates code duplication across the monorepo.
 * All pure, side-effect-free utilities should live here.
 */

/**
 * Normalize text for comparison and processing.
 * Trims whitespace and converts to lowercase.
 */
export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Remove duplicate values from an array while preserving order.
 */
export function dedupe<T>(values: T[]): T[] {
  return [...new Set(values)];
}

/**
 * Collect strong word markers from text.
 * Strong words indicate potential overclaiming or absolutization.
 */
export function collectStrongWordMarkers(text: string): string[] {
  const strongWords = [
    'always', 'never', 'guarantee', 'truth', 'essence',
    'definitely', 'certainly', 'undoubtedly', 'absolutely',
    'everyone', 'nobody', 'everything', 'nothing'
  ];

  return strongWords.filter(word =>
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
}

/**
 * Collect strong word hits (actual occurrences) from text.
 * Returns array of found strong words with their positions.
 */
export function collectStrongWordHits(text: string): Array<{ word: string; index: number }> {
  const strongWords = [
    'always', 'never', 'guarantee', 'truth', 'essence',
    'definitely', 'certainly', 'undoubtedly', 'absolutely',
    'everyone', 'nobody', 'everything', 'nothing'
  ];

  const hits: Array<{ word: string; index: number }> = [];

  for (const word of strongWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      hits.push({ word: match[0].toLowerCase(), index: match.index });
    }
  }

  return hits.sort((a, b) => a.index - b.index);
}

/**
 * Check if text contains uncertainty markers.
 * These indicate appropriate epistemic humility.
 */
export function hasUncertaintyMarkers(text: string): boolean {
  const markers = [
    'may', 'might', 'could', 'possibly', 'perhaps',
    'suggests', 'indicates', 'appears', 'seems',
    'возможно', 'может быть', 'вероятно', 'предположительно'
  ];

  return markers.some(marker =>
    new RegExp(`\\b${marker}\\b`, 'i').test(text)
  );
}

/**
 * Deep equality check for simple objects/arrays.
 * Uses JSON serialization for comparison.
 * Note: Not suitable for objects with functions, undefined, or circular refs.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Truncate text to maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate a simple unique ID with prefix.
 * Not cryptographically secure, but sufficient for client-side IDs.
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Sleep for specified milliseconds.
 * Useful for async operations and testing.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max values.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format a number as percentage with fixed decimals.
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
