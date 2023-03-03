import { describe, it, expect } from 'vitest';
import { isErrorHandler } from './error-handler';

describe('isErrorHandler test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;
    const aAsyncFunWith4Params = async (a: any, b: any, c: any, d: any) => {};

    expect(isErrorHandler(aNumber)).toStrictEqual(false);
    expect(isErrorHandler(aStr)).toStrictEqual(false);
    expect(isErrorHandler(aObj)).toStrictEqual(false);
    expect(isErrorHandler(aBool)).toStrictEqual(false);
    expect(isErrorHandler(aAsyncFunWith4Params)).toStrictEqual(false);
  });
  it('should return true for ErrorHandlers', () => {
    const errorH1 = (a: any, b: any, c: any, d: any) => {};
    const errorH2 = (a: any, b: any, c: any, d: any) => {};

    expect(isErrorHandler(errorH1)).toStrictEqual(true);
    expect(isErrorHandler(errorH2)).toStrictEqual(true);
  });
});
