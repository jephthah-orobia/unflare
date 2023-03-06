import { describe, it, expect } from 'vitest';
import { RequestHandler } from './request-handler';
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

  it('should be an instance of RequestHandler', () => {
    const route = new Route('/api/users');

    expect(route instanceof RequestHandler).toBe(true);
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

  it('should return true if the request method is added to route', () => {
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

  it('should return true when path is wildcard `*`', async () => {
    const route1 = new Route('*');
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

describe('Route::tryToHandle()', () => {
  it('should set the params property of the requester and set the isDone property of the responder given valid handlers', async () => {
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
    expect(() => route1.tryToHandle(req1, res)).not.toThrowError();
    expect(req1.params).toStrictEqual({ id: '1234', email: 'test@test.test' });
    expect(res.isDone).toStrictEqual(true);
  });

  it('should set the body property of the requester and set the isDone property of the responder given valid handlers', async () => {
    const route1 = new Route('/api/users');
    const bodyToSend = { email: 'test@test.com', password: 'Abc123' };
    const reqO = new Request('https://example.com/api/users', {
      method: 'POST',
      body: JSON.stringify(bodyToSend),
    });
    const encoder = new TextEncoder();
    reqO.headers.set('Content-Type', 'application/json');
    reqO.headers.set(
      'Content-Length',
      encoder.encode(JSON.stringify(bodyToSend)).length.toString()
    );

    const req1 = await Requester.fromRequest(reqO);

    route1.post((req: Requester, res: Responder) => {
      res.send(JSON.stringify(req.body));
    });

    expect(req1.body).toBeDefined();
    expect(req1.body).toStrictEqual(bodyToSend);

    expect(route1.canHandle(req1)).toStrictEqual(true);
    const res = new Responder('example.com');
    expect(() => route1.tryToHandle(req1, res)).not.toThrowError();
    expect(res.isDone).toStrictEqual(true);
    expect(await res.response.json()).toStrictEqual(bodyToSend);
  });

  it('should handle wild cards request', async () => {
    const route = new Route('*');
    const msg = 'I have recieved the request.';
    route.get((req: Requester, res: Responder) => {
      res.status(402).send(msg);
    });

    const responder = new Responder('example.com');
    const requester = new Requester(
      new Request('https://example.com/somepaththatmightnotexist', {
        method: 'GET',
      })
    );

    expect(route.canHandle(requester)).toBe(true);

    expect(async () => {
      await route.tryToHandle(requester, responder);
    }).not.toThrowError();

    await route.tryToHandle(requester, responder);
    const res = responder.response;
    expect(res.status).toBe(402);
    const resBody = await res.text();
    expect(resBody).toBe(msg);
  });
});

describe('Route::routeOfPath', () => {
  const pattern1 = /\/api\/users/i;
  const route1 = new Route('/api/users');
  const route2 = new Route('/api/users/:id/email/:email');
  const route3 = new Route(pattern1);

  it('should return a route or null according to the provided path', () => {
    expect(route1.path).toStrictEqual('/api/users');
    expect(route2.path).toStrictEqual('/api/users/:id/email/:email');
    //@ts-ignore
    expect(pattern1.source.replaceAll('\\/', '/')).toStrictEqual('/api/users');
    expect(route3.path).toStrictEqual('/api/users');
    expect(route1.routeOfPath('/api/email')).toStrictEqual(null);
    expect(route2.routeOfPath('/api/users')).toStrictEqual(null);
    expect(route3.routeOfPath('/api/users')).toStrictEqual(route3);
    expect(route1.routeOfPath('/api/users')).toStrictEqual(route1);
    expect(route2.routeOfPath('/api/users/12314/email/asdgas')).toStrictEqual(
      route2
    );
  });
});
