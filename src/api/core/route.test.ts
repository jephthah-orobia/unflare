import { describe, it, expect } from 'vitest';
import { RequestHandler } from './request-handler';
import { RequestInspector } from './request-inspector';
import { ResponseFactory } from './response-factory';
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
    const req1 = new RequestInspector(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.post(() => {
      route1.res.send('Hello');
    });
    expect(route1.canHandle(req1)).toStrictEqual(false);
  });

  it('should return true if the request method is added to route', async () => {
    const route = new Route('/');
    route.get(() => {});
    const req = await RequestInspector.fromRequest(
      new Request('https://example.com/')
    );
    expect(req.path).toBe('/');
    expect(route.canHandle(req)).toBe(true);
    const route1 = new Route('/api/users');
    const req1 = new RequestInspector(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.get(() => {
      route1.res.send('Hello');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true if the route has a handler with method ALL', () => {
    const route1 = new Route('/api/users');
    const req1 = new RequestInspector(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.all(() => {
      route1.res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true for request whose path matches the route with params', async () => {
    const route1 = new Route('/api/users/:id/email/:email');
    const route2 = new Route('/:pageName');
    const req1 = await RequestInspector.fromRequest(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    const req2 = await RequestInspector.fromRequest(
      new Request('https://example.com/home', {
        method: 'GET',
      })
    );
    route1.get(() => {
      route1.res.send('Method for All');
    });
    route2.get(() => {
      const { params, res } = route2;
      res.send(params.pageName);
    });
    expect(route1.canHandle(req1)).toBe(true);
    expect(route2.canHandle(req2)).toBe(true);
  });

  it('should return true when path is wildcard `*`', async () => {
    const route1 = new Route('*');
    const req1 = new RequestInspector(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    route1.get(() => {
      route1.res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });
});

describe('Route::tryToHandle()', () => {
  it('should set the params property of the requester and set the isDone property of the ResponseFactory given valid handlers', async () => {
    const route1 = new Route('/api/users/:id/email/:email');
    const req1 = new RequestInspector(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    route1.get(() => {
      route1.res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
    const res = new ResponseFactory('example.com');
    expect(() => route1.tryToHandle(req1, res)).not.toThrowError();
    expect(req1.params).toStrictEqual({ id: '1234', email: 'test@test.test' });
    expect(res.isDone).toStrictEqual(true);
  });

  it('should set the body property of the requester and set the isDone property of the ResponseFactory given valid handlers', async () => {
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

    const req1 = await RequestInspector.fromRequest(reqO);

    route1.post(() => {
      route1.res.send(JSON.stringify(route1.req.body));
    });

    expect(req1.body).toBeDefined();
    expect(req1.body).toStrictEqual(bodyToSend);

    expect(route1.canHandle(req1)).toStrictEqual(true);
    const res = new ResponseFactory('example.com');
    expect(() => route1.tryToHandle(req1, res)).not.toThrowError();
    expect(res.isDone).toStrictEqual(true);
    expect(await res.response.json()).toStrictEqual(bodyToSend);
  });

  it('should handle wild cards request', async () => {
    const route = new Route('*');
    const msg = 'I have recieved the request.';
    route.get(() => {
      route.res.status(402).send(msg);
    });

    const resf = new ResponseFactory('example.com');
    const requester = new RequestInspector(
      new Request('https://example.com/somepaththatmightnotexist', {
        method: 'GET',
      })
    );

    expect(route.canHandle(requester)).toBe(true);

    expect(async () => {
      await route.tryToHandle(requester, resf);
    }).not.toThrowError();

    await route.tryToHandle(requester, resf);
    const res = resf.response;
    expect(res.status).toBe(402);
    const resBody = await res.text();
    expect(resBody).toBe(msg);
  });
});
