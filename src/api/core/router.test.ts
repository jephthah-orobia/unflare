import { describe, expect, it } from 'vitest';
import { HTTPVerbs } from '../enums/http-verbs';
import { Requester } from './requester';
import { Responder } from './responder';
import { Route } from './route';
import { Router } from './router';

describe('Router Constructor', () => {
  it('Property test', () => {
    const router = new Router();
    expect(router).toHaveProperty('use');
    expect(router).toHaveProperty('get');
    expect(router).toHaveProperty('head');
    expect(router).toHaveProperty('post');
    expect(router).toHaveProperty('put');
    expect(router).toHaveProperty('delete');
    expect(router).toHaveProperty('connect');
    expect(router).toHaveProperty('options');
    expect(router).toHaveProperty('patch');
    expect(router).toHaveProperty('all');
  });
});

describe('Router::canHandle()', () => {
  it('should return false if the request method is not added to router', () => {
    const route1 = new Router();
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.post('/api/users', (req: Requester, res: Responder) => {
      res.send('Hello');
    });
    expect(route1.canHandle(req1)).toStrictEqual(false);
  });

  it('should return true if the request method is added to router', () => {
    const route1 = new Router();
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1
      .get('/api/users', (req: Requester, res: Responder) => {
        res.send('Hello');
      })
      .post('/api/users', (req: Requester, res: Responder) => {
        res.send('You ask to post?');
      });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true if the router has a handler with method ALL', () => {
    const route1 = new Router();
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.all('/api/users', (req: Requester, res: Responder) => {
      res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true for request whose path matches the router with params', () => {
    const route1 = new Router();
    const req1 = new Requester(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    route1.get(
      '/api/users/:id/email/:email',
      (req: Requester, res: Responder) => {
        res.send('Method for All');
      }
    );
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });
});

describe('Router::routOfPath()', () => {
  const pattern1 = /\/api\/users/i;
  const path0 = '/api/users/:id/email/:email';
  const path1 = '/api/users';
  const path2 = '*';

  it('should return a route or null according to the provided path', () => {
    const router = new Router();
    const route0 = router.get(path0, (req, res) => {
      res.send('home page');
    });
    const route0copy = router.get(path0, (req, res) => {
      res.send('this should be unreachable');
    });

    expect(route0).toBe(route0copy);

    const route1 = router.get(path1, (req, res) => {
      res.send('this is route1');
    });
    const route1copy = router.get(path1, (req, res) => {
      res.send('this should be unreachable');
    });

    expect(route1).toBe(route1copy);
    expect(route0).not.toBe(route1);
    expect(route1).not.toBe(route0);

    const route2 = router.get(path2, (req, res) => {
      res.send('this is route 2');
    });
    const route2copy = router.get(path2, (req, res) => {
      res.send('this should be unreachable');
    });
    expect(route2).toBe(route2copy);
    expect(route0).not.toBe(route2);
    expect(route1).not.toBe(route2);

    const route3 = router.get(pattern1, (req, res) => {
      res.send('this is route 3');
    });
    const route3copy = router.get(pattern1, (req, res) => {
      res.send('this should be unreachable');
    });

    expect(route3).toBe(route3copy);
    expect(route0).not.toBe(route2);
    expect(route1).not.toBe(route2);
  });
});

describe('Router::tryToHandle()', () => {
  it('should set the params property of the requester and set the isDone property of the responder given valid handlers', async () => {
    const route1 = new Router();
    const req1 = new Requester(
      new Request('https://example.com/api/users/1234/email/test@test.test', {
        method: 'GET',
      })
    );
    route1.get(
      '/api/users/:id/email/:email',
      (req: Requester, res: Responder) => {
        res.send('Method for All');
      }
    );
    expect(route1.canHandle(req1)).toStrictEqual(true);
    const res = new Responder('example.com');
    expect(() => route1.tryToHandle(req1, res)).not.toThrowError();
    expect(req1.params).toStrictEqual({ id: '1234', email: 'test@test.test' });
    expect(res.isDone).toStrictEqual(true);

    const route2 = new Router();
    const req = new Request('https://www.example.com', { method: 'GET' });
    const req_1 = new Request('https://www.example.com/user/keeser', {
      method: 'GET',
    });
    const req_2 = new Request('https://www.example.com/users', {
      method: 'GET',
    });
    const reser1 = new Responder('www.example.com');
    const reser2 = new Responder('www.example.com');
    const reser3 = new Responder('www.example.com');

    route2.get('/', (req: Requester, res: Responder) => {
      res.send('Hello World');
    });

    route2.get('/user/:id', (re: Requester, res: Responder) => {
      res.send(re.params.id);
    });

    route2.get('/users', (req: Requester, res: Responder) => {
      res.send('users here');
    });

    await route2.tryToHandle(new Requester(req), reser1);
    expect(reser1.isDone).toBe(true);
    const res1 = reser1.response;
    expect(await res1?.text()).toStrictEqual('Hello World');
    await route2.tryToHandle(new Requester(req_1), reser2);
    expect(reser2.isDone).toBe(true);
    const res2 = reser2.response;
    expect(await res2?.text()).toStrictEqual('keeser');
    await route2.tryToHandle(new Requester(req_2), reser3);
    expect(reser3.isDone).toBe(true);
    const res3 = reser3.response;
    expect(await res3?.text()).toStrictEqual('users here');
  });

  it('should handle wild cards request', async () => {
    const router = new Router();
    const msg = 'I have recieved the request.';

    //console.dir(router);
    router.get('*', (req: Requester, res: Responder) => {
      res.status(402).send(msg);
    });

    router.get('/', (req: Requester, res: Responder) => {
      res.send('home');
    });

    //console.dir(router);
    const responder = new Responder('example.com');
    const responder1 = new Responder('example.com');
    const requester = new Requester(
      new Request('https://example.com/somepaththatmightnotexist')
    );

    const requester1 = await Requester.fromRequest(
      new Request('https://example.com/')
    );

    expect(async () => {
      await router.tryToHandle(requester, responder);
    }).not.toThrowError();

    expect(router.canHandle(requester)).toBe(true);
    await router.tryToHandle(requester, responder);
    const res = responder.response;
    expect(res.status).toBe(402);
    const resBody = await res.text();
    expect(resBody).toBe(msg);

    expect(async () => {
      await router.tryToHandle(requester1, responder);
    }).not.toThrowError();

    expect(router.canHandle(requester1)).toBe(true);
    await router.tryToHandle(requester1, responder1);
    const res1 = responder.response;
    expect(res1.status).toBe(402);
    const resBody1 = await res1.text();
    expect(resBody1).toBe(msg);
  });
});
