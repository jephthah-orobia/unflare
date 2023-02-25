import { describe, it, expect } from 'vitest';
import { isJson } from './is-json';

describe('isJson', () => {
  it('should return false for strings that cannot be parsed into objects', () => {
    expect(isJson('asd/sdga/skjksdlf')).toStrictEqual(false);
    expect(isJson('example.com')).toStrictEqual(false);
    expect(isJson('query=Aszfasd&qwer=124')).toStrictEqual(false);
  });

  it('should return true for strings that can be parsed into objects', () => {
    expect(isJson('[]')).toStrictEqual(true);
    expect(isJson('["asdfa", "asdga", 1, 3, 3]')).toStrictEqual(true);
    expect(
      isJson('{ "Pearson": { "first": "Jon", "last": "son"}}')
    ).toStrictEqual(true);
  });
});
