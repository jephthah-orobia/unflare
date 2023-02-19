import { describe, it, expect } from 'vitest';
import { isMiddleware, isAsyncMiddleware } from './middleware';

describe('isMiddleware test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;
    const aAsyncFunWith3Params = async (a: any, b: any, c: any) => {};

    expect(isMiddleware(aNumber)).toStrictEqual(false);
    expect(isMiddleware(aStr)).toStrictEqual(false);
    expect(isMiddleware(aObj)).toStrictEqual(false);
    expect(isMiddleware(aBool)).toStrictEqual(false);
    expect(isMiddleware(aAsyncFunWith3Params)).toStrictEqual(false);
  });
  it('should return true for Middlewares', () => {
    const mwH1 = (a: any, b: any, c: any) => {};
    const mwH2 = (a: any, b: any, c: any) => {};

    expect(isMiddleware(mwH1)).toStrictEqual(true);
    expect(isMiddleware(mwH2)).toStrictEqual(true);
  });
});

describe('isAsyncMiddleware test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;
    const aSyncFunWith3Params = (a: any, b: any, c: any) => {};

    expect(isAsyncMiddleware(aNumber)).toStrictEqual(false);
    expect(isAsyncMiddleware(aStr)).toStrictEqual(false);
    expect(isAsyncMiddleware(aObj)).toStrictEqual(false);
    expect(isAsyncMiddleware(aBool)).toStrictEqual(false);
    expect(isAsyncMiddleware(aSyncFunWith3Params)).toStrictEqual(false);
  });
  it('should return true for Middlewares', () => {
    const mwH1 = async (a: any, b: any, c: any) => {};
    const mwH2 = async (a: any, b: any, c: any) => {};

    expect(isAsyncMiddleware(mwH1)).toStrictEqual(true);
    expect(isAsyncMiddleware(mwH2)).toStrictEqual(true);
  });
});
