import { stableSelection } from "./algo";
import { buildPreferenceMatrix } from "./preferences";

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

  expect(result).toHaveLength(n);
  expect(new Set(result).size).toBe(n);
  result.forEach((m) => {
    expect(m).toBeGreaterThanOrEqual(0);
    expect(m).toBeLessThan(n);
  });
});

test("buildPreferenceMatrix accepts legacy strings", () => {
  const n = 3;
  const group = {
    m_pref: ["123", "213", "132"],
    f_pref: ["123", "213", "321"],
  };

  const matrix = buildPreferenceMatrix(group, n);
  expect(matrix).toHaveLength(n * 2);
  expect(matrix[0]).toEqual([3, 4, 5]);
});
