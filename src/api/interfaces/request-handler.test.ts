import { describe, expect, it } from 'vitest';
import { Route } from '../core/route';
import { Router } from '../core/router';
import { isRequestHandler } from './request-handler';

describe('isRequestHandler()', () => {
  it('should return true when an object is Router or Route class', () => {
    const route = new Route('/api/users');
    const router = new Router();

    expect(isRequestHandler(route)).toStrictEqual(true);
    expect(isRequestHandler(router)).toStrictEqual(true);
  });
});
