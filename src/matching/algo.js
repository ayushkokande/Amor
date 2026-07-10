function wPrefersM1OverM(prefMatrix, w, m, m1, n) {
  for (let i = 0; i < n; i++) {
    if (prefMatrix[w][i] === m1) return true;
    if (prefMatrix[w][i] === m) return false;
  }
  return false;
}

/**
 * Gale–Shapley stable matching (men propose).
 * @param {number[][]} prefMatrix
 * @param {number} n
 * @returns {number[]}
 */
export function stableSelection(prefMatrix, n) {
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
