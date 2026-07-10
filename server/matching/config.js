/** Per-gender pool size (6 males + 6 females = 12 total). */
const GROUP_SIZE = 6;
const TOTAL_GROUP = GROUP_SIZE * 2;

/** Women are indexed at n..2n-1 in the Gale–Shapley preference matrix. */
const MALE_INDEX_OFFSET = GROUP_SIZE;

function createEmptyPreferences(size = GROUP_SIZE) {
  return Array(size).fill(null);
}

module.exports = {
  GROUP_SIZE,
  TOTAL_GROUP,
  MALE_INDEX_OFFSET,
  createEmptyPreferences,
};
