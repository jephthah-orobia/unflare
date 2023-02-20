import { describe, it, expect } from 'vitest';
import { Requester } from './requester';
import { Responder } from './responder';
import { Route } from './route';

describe('Route contrustor', () => {
  it('should have all methods from HTTPVerbs + .use and .all', () => {
    const route = new Route('/api/users');

    expect(route).toHaveProperty('use');
    expect(route).toHaveProperty('get');
    expect(route).toHaveProperty('head');
    expect(route).toHaveProperty('post');
    expect(route).toHaveProperty('put');
    expect(route).toHaveProperty('delete');
    expect(route).toHaveProperty('connect');
    expect(route).toHaveProperty('options');
    expect(route).toHaveProperty('patch');
    expect(route).toHaveProperty('all');
  });
});

describe('Route::canHandle()', () => {
  it('should return false if the request method is not added to route', () => {
    const route1 = new Route('/api/users');
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.post((req: Requester, res: Responder) => {
      res.send('Hello');
    });
    expect(route1.canHandle(req1)).toStrictEqual(false);
  });

  it('should return true if the request method is not added to route', () => {
    const route1 = new Route('/api/users');
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.get((req: Requester, res: Responder) => {
      res.send('Hello');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true if the route has a handler with method ALL', () => {
    const route1 = new Route('/api/users');
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.all((req: Requester, res: Responder) => {
      res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true for request whose path matches the route with params', () => {
    const route1 = new Route('/api/users/:id/email/:email');
    const req1 = new Requester(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    route1.get((req: Requester, res: Responder) => {
      res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });
});

describe('Route::handle()', () => {
  it('should set the params property of the requester and set the isDone property of the responder given valid handlers', () => {
    const route1 = new Route('/api/users/:id/email/:email');
    const req1 = new Requester(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    route1.get((req: Requester, res: Responder) => {
      res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
    const res = new Responder('example.com');
    expect(() => route1.handle(req1, res)).not.toThrowError();
    expect(req1.params).toStrictEqual({ id: '1234', email: 'test@test.test' });
    expect(res.isDone).toStrictEqual(true);
  });
});
