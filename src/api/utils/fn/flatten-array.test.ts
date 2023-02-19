import { describe, it, expect } from 'vitest';
import { flattenArray } from './flatten-array';

describe('flattenArray', () => {
  it('should return an empty array if there is none provided', () => {
    expect(flattenArray()).toStrictEqual([]);
  });

  it('should return [1,2,3] for [[1,2],3]', () => {
    const ar = flattenArray([[1, 2], 3]);
    expect(ar).toStrictEqual([1, 2, 3]);
  });

  it('should return a single dimension array', () => {
    const arr = flattenArray(1, [2, 3], [[[4, 5], 6, [7, 8]], 9]);
    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
