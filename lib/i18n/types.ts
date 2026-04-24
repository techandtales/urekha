import type { Language } from "@/types/languages";

/**
 * A single translation entry: one value per supported language.
 * Add new languages here and they'll propagate everywhere.
 */
export type TranslationEntry = Record<Language, string>;

/**
 * A map of all translations for a page/section.
 * Keys are the semantic label (e.g. "chartTitle"), values are per-language strings.
 */
export type TranslationMap<K extends string = string> = Record<
  K,
  TranslationEntry
>;

/**
 * Resolves a TranslationMap into a flat Record<K, string> for the given language.
 * Usage:
 *   const t = resolveTranslations(lagnaTranslations, "hi");
 *   t.chartTitle → "लग्न कुंडली (D1)"
 */
export function resolveTranslations<K extends string>(
  map: TranslationMap<K>,
  lang: Language,
): Record<K, string> {
  const resolved = {} as Record<K, string>;
  for (const key in map) {
    resolved[key] = map[key][lang] ?? map[key]["en"]; // Fallback to English
  }
  return resolved;
}