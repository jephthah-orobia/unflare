import { describe, expect, it } from 'vitest';
import { Route } from '../core/route';
import { Router } from '../core/router';
import { isRequestHandler } from './request-handler';

describe('isRequestHandler()', () => {
  it('should return true when an object is Router or Route class or if the class implements RequestHandler interface', () => {
    const route = new Route('/api/users');
    const router = new Router();

    const obj = {
      canHandle(some: any) {
        return true;
      },
      routeOfPath(some: any) {
        return {};
      },
      handle(some1: any, some2: any, some3: any) {
        return;
      },
    };
    expect(isRequestHandler(route)).toStrictEqual(true);
    expect(isRequestHandler(router)).toStrictEqual(true);
    expect(isRequestHandler(obj)).toStrictEqual(true);
  });
  it('should return false otherwise ', () => {
    expect(isRequestHandler(123)).toStrictEqual(false);
    expect(isRequestHandler({ withSomeProps: true })).toStrictEqual(false);
    expect(isRequestHandler('{withSomeProps: true}')).toStrictEqual(false);
    expect(
      isRequestHandler({
        canHandle() {
          return true;
        },
        routeOfPath() {
          return {};
        },
        handle() {
          return;
        },
      })
    ).toStrictEqual(false);
  });
});
