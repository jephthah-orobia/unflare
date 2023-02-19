import { describe, expect, it } from 'vitest';
import { isPromise } from './is-promise';

describe('isPromise()', () => {
  it('should return false when an object is not a promise', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;
    const aFunction = () => {};
    const aAsyncFunction = async () => {};

    expect(isPromise(aNumber)).toStrictEqual(false);
    expect(isPromise(aStr)).toStrictEqual(false);
    expect(isPromise(aObj)).toStrictEqual(false);
    expect(isPromise(aBool)).toStrictEqual(false);
    expect(isPromise(aFunction)).toStrictEqual(false);
    expect(isPromise(aAsyncFunction)).toStrictEqual(false);
  });

  it('should return true for objects that are promises', () => {
    const add = (a: number, b: number): Promise<number> =>
      Promise.resolve(a + b);
    const add1 = async (a: number, b: number): Promise<number> => a + b;

    expect(
      isPromise(
        new Promise((res) => {
          res('this');
        })
      )
    ).toStrictEqual(true);
    expect(isPromise(add(3, 5))).toStrictEqual(true);
    expect(isPromise(add1(3, 5))).toStrictEqual(true);
  });
});
