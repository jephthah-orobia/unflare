import { describe, it, expect } from 'vitest';
import { isRouteHandler, isAsyncRouteHandler } from './route-handler';

describe('isRouteHandler test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;
    const aAsyncFunWith2Params = async (a: any, b: any) => {};

    expect(isRouteHandler(aNumber)).toStrictEqual(false);
    expect(isRouteHandler(aStr)).toStrictEqual(false);
    expect(isRouteHandler(aObj)).toStrictEqual(false);
    expect(isRouteHandler(aBool)).toStrictEqual(false);
    expect(isRouteHandler(aAsyncFunWith2Params)).toStrictEqual(false);
  });
  it('should return true for RouteHandlers', () => {
    const RouteH1 = (a: any, b: any) => {};
    const RouteH2 = (a: any, b: any) => {};

    expect(isRouteHandler(RouteH1)).toStrictEqual(true);
    expect(isRouteHandler(RouteH2)).toStrictEqual(true);
  });
});

describe('isAsyncRouteHandler test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;
    const aSyncFunWith2Params = (a: any, b: any) => {};

    expect(isAsyncRouteHandler(aNumber)).toStrictEqual(false);
    expect(isAsyncRouteHandler(aStr)).toStrictEqual(false);
    expect(isAsyncRouteHandler(aObj)).toStrictEqual(false);
    expect(isAsyncRouteHandler(aBool)).toStrictEqual(false);
    expect(isAsyncRouteHandler(aSyncFunWith2Params)).toStrictEqual(false);
  });
  it('should return true for RouteHandlers', () => {
    const RouteH1 = async (a: any, b: any) => {};
    const RouteH2 = async (a: any, b: any) => {};

    expect(isAsyncRouteHandler(RouteH1)).toStrictEqual(true);
    expect(isAsyncRouteHandler(RouteH2)).toStrictEqual(true);
  });
});
