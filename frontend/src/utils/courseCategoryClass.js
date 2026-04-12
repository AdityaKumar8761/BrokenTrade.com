const SLUGS = new Set(['bonds', 'crypto', 'ipo', 'finance', 'trading', 'investing']);

/**
 * Normalized slug for course category styling (Bonds, Crypto, IPO, Finance, Trading, Investing).
 */
export function courseCategorySlug(category) {
  const k = String(category || '')
    .trim()
    .toLowerCase();
  return SLUGS.has(k) ? k : 'default';
}

/** Classes for pills / tags (course cards, tables, sidebar). */
export function courseCategoryClass(category) {
  return `course-cat course-cat--${courseCategorySlug(category)}`;
}
