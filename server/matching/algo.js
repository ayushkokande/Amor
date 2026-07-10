/**
 * Gale–Shapley stable matching (men propose).
 * @param {number[][]} prefMatrix rows for n men then n women
 * @param {number} n pool size per gender
 * @returns {number[]} for each woman (0..n-1), matched man index (0..n-1)
 */
function wPrefersM1OverM(prefMatrix, w, m, m1, n) {
  for (let i = 0; i < n; i++) {
    if (prefMatrix[w][i] === m1) return true;
    if (prefMatrix[w][i] === m) return false;
  }
  return false;
}

function stableSelection(prefMatrix, n) {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("Pool size n must be a positive integer");
  }

  const expectedRows = n * 2;
  if (!Array.isArray(prefMatrix) || prefMatrix.length !== expectedRows) {
    throw new Error(`Expected ${expectedRows} preference rows`);
  }

  const wSelect = Array(n).fill(-1);
  const mFree = Array(n).fill(false);
  let freeCount = n;
  const nextProposal = Array(n).fill(0);

  while (freeCount > 0) {
    let m = 0;
    while (m < n && mFree[m]) m++;
    if (m >= n) break;

    const w = prefMatrix[m][nextProposal[m]];
    nextProposal[m]++;

    const womanSlot = w - n;
    if (womanSlot < 0 || womanSlot >= n) {
      throw new Error(`Invalid woman index ${w} for man ${m}`);
    }

    if (wSelect[womanSlot] === -1) {
      wSelect[womanSlot] = m;
      mFree[m] = true;
      freeCount--;
    } else {
      const m1 = wSelect[womanSlot];
      if (wPrefersM1OverM(prefMatrix, w, m, m1, n) === false) {
        wSelect[womanSlot] = m;
        mFree[m] = true;
        mFree[m1] = false;
      }
    }
  }

  return wSelect;
}

module.exports = stableSelection;
