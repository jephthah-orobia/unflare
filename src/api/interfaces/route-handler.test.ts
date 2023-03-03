import { describe, it, expect } from 'vitest';
import { isRouteHandler } from './route-handler';

describe('isRouteHandler test', () => {
  it('should return false for other types', () => {
    const aNumber = 3;
    const aStr = 'asdg';
    const aObj = { someProp: 'asdf' };
    const aBool = false;

    expect(isRouteHandler(aNumber)).toStrictEqual(false);
    expect(isRouteHandler(aStr)).toStrictEqual(false);
    expect(isRouteHandler(aObj)).toStrictEqual(false);
    expect(isRouteHandler(aBool)).toStrictEqual(false);
  });

  it('should return true for RouteHandlers', () => {
    const RouteH1 = (a: any, b: any) => {};
    const RouteH2 = (a: any, b: any) => {};

    expect(isRouteHandler(RouteH1)).toStrictEqual(true);
    expect(isRouteHandler(RouteH2)).toStrictEqual(true);
  });
});
