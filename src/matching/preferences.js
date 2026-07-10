import { GROUP_SIZE } from "./config";

export function legacyStringToRankedIndices(str, n) {
  if (!str || str.length !== n) {
    throw new Error(`Invalid legacy preference string length: ${str}`);
  }

  const ranks = str.split("").map((digit) => parseInt(digit, 10));
  return ranks
    .map((rank, idx) => ({ idx, rank }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ idx }) => idx);
}

export function normalizePreference(pref, n) {
  if (pref == null) return null;
  if (Array.isArray(pref)) return pref;
  if (typeof pref === "string") return legacyStringToRankedIndices(pref, n);
  throw new Error("Preference must be an array of indices or legacy string");
}

export function validatePermutation(orderedIndices, n) {
  if (!Array.isArray(orderedIndices) || orderedIndices.length !== n) {
    throw new Error(`Expected ${n} ranked indices`);
  }

  const sorted = [...orderedIndices].sort((a, b) => a - b);
  for (let i = 0; i < n; i++) {
    if (sorted[i] !== i) {
      throw new Error("Preferences must be a permutation of target indices");
    }
  }
}

export function buildPreferenceMatrix(group, n = GROUP_SIZE) {
  const matrix = [];

  for (let i = 0; i < n; i++) {
    const ordered = normalizePreference(group.m_pref[i], n);
    if (!ordered) throw new Error(`Missing male preference at index ${i}`);
    validatePermutation(ordered, n);
    matrix.push(ordered.map((idx) => idx + n));
  }

  for (let i = 0; i < n; i++) {
    const ordered = normalizePreference(group.f_pref[i], n);
    if (!ordered) throw new Error(`Missing female preference at index ${i}`);
    validatePermutation(ordered, n);
    matrix.push(ordered);
  }

  return matrix;
}

export function picksToRankedIndices(picks, n) {
  const rankByIndex = Array(n).fill(null);
  picks.forEach(({ obj: { idx, pref } }) => {
    rankByIndex[idx] = pref;
  });

  if (rankByIndex.some((rank) => rank === null)) {
    throw new Error("Incomplete preferences");
  }

  return rankByIndex
    .map((rank, idx) => ({ idx, rank }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ idx }) => idx);
}
