const test = require("node:test");
const assert = require("node:assert/strict");
const stableSelection = require("./algo");
const { buildPreferenceMatrix } = require("./preferences");

test("stableSelection returns n matches for n=3", () => {
  const n = 3;
  const group = {
    m_pref: [
      [0, 1, 2],
      [1, 0, 2],
      [0, 2, 1],
    ],
    f_pref: [
      [0, 1, 2],
      [1, 0, 2],
      [2, 0, 1],
    ],
  };

  const matrix = buildPreferenceMatrix(group, n);
  const result = stableSelection(matrix, n);

  assert.equal(result.length, n);
  assert.ok(result.every((m) => m >= 0 && m < n));
  assert.equal(new Set(result).size, n);
});

test("stableSelection works for default n=6 sample", () => {
  const n = 6;
  const group = {
    m_pref: [
      [0, 1, 2, 3, 4, 5],
      [1, 0, 2, 3, 4, 5],
      [2, 1, 0, 3, 4, 5],
      [3, 2, 1, 0, 4, 5],
      [4, 3, 2, 1, 0, 5],
      [5, 4, 3, 2, 1, 0],
    ],
    f_pref: [
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
    ],
  };

  const matrix = buildPreferenceMatrix(group, n);
  const result = stableSelection(matrix, n);
  assert.equal(result.length, n);
  assert.equal(new Set(result).size, n);
});

test("buildPreferenceMatrix accepts legacy strings", () => {
  const n = 3;
  const group = {
    m_pref: ["123", "213", "132"],
    f_pref: ["123", "213", "321"],
  };

  const matrix = buildPreferenceMatrix(group, n);
  assert.equal(matrix.length, n * 2);
  assert.deepEqual(matrix[0], [0, 1, 2].map((i) => i + n));
});

test("stableSelection rejects invalid pool size", () => {
  assert.throws(() => stableSelection([], 0), /positive integer/);
});
