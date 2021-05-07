// let m_pref = [
//   [7, 4, 5, 6],
//   [5, 4, 6, 7],
//   [5, 6, 4, 7],
//   [6, 7, 5, 4],
// ];
// let w_pref = [
//   [0, 1, 2, 3],
//   [0, 1, 2, 3],
//   [0, 1, 2, 3],
//   [0, 1, 2, 3],
// ];

// let prefMatrix = [...m_pref, ...w_pref];

function wPrefersM1OverM(prefMatrix, w, m, m1) {
  let n = 6;
  for (let i = 0; i < n; i++) {
    if (prefMatrix[w][i] == m1) return true;

    if (prefMatrix[w][i] == m) return false;
  }
}

function stableSelection(prefMatrix) {
  let wSelect = [-1, -1, -1, -1, -1, -1];
  let mFree = [false, false, false, false, false, false];
  let n = 6;

  let freecount = 6;

  while (freecount > 0) {
    let m;
    for (m = 0; m < n; m++) if (mFree[m] === false) break;

    for (let i = 0; i < n && mFree[m] === false; i++) {
      let w = prefMatrix[m][i];

      if (wSelect[w - n] === -1) {
        wSelect[w - n] = m;
        mFree[m] = true;
        freecount--;
      } else {
        let m1 = wSelect[w - n];
        if (wPrefersM1OverM(prefMatrix, w, m, m1) === false) {
          wSelect[w - n] = m;
          mFree[m] = true;
          mFree[m1] = false;
        }
      }
    }
  }
  return wSelect;
}

module.exports = stableSelection;
