import { describe, it, expect } from 'vitest';
import { isMiddleware } from './middleware';

describe('isMiddleware test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;

    expect(isMiddleware(aNumber)).toStrictEqual(false);
    expect(isMiddleware(aStr)).toStrictEqual(false);
    expect(isMiddleware(aObj)).toStrictEqual(false);
    expect(isMiddleware(aBool)).toStrictEqual(false);
  });
  it('should return true for Middlewares', () => {
    const mwH1 = (a: any, b: any, c: any) => {};
    const mwH2 = (a: any, b: any, c: any) => {};

    expect(isMiddleware(mwH1)).toStrictEqual(true);
    expect(isMiddleware(mwH2)).toStrictEqual(true);
  });
});
