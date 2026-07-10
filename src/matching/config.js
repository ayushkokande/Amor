/** Per-gender pool size (6 males + 6 females = 12 total). */
export const GROUP_SIZE = 6;
export const TOTAL_GROUP = GROUP_SIZE * 2;

/** Women are indexed at n..2n-1 in the Gale–Shapley preference matrix. */
export const MALE_INDEX_OFFSET = GROUP_SIZE;

export function createEmptyPreferences(size = GROUP_SIZE) {
  return Array(size).fill(null);
}

export function createRankOptions(size = GROUP_SIZE) {
  return Array.from({ length: size }, (_, i) => i + 1);
}
