import { describe, expect, it } from 'vitest';
import { Router } from './router';
import { Requester } from './requester';
import { ResponseFactory } from './response-factory';
import { Route } from './route';

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
    route1.post('/api/users', () => {
      const { res } = route1;
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
      .get('/api/users', () => {
        const { res } = route1;
        res.send('Hello');
      })
      .post('/api/users', () => {
        const { res } = route1;
        res.send('You ask to post?');
      });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true if the router has a handler with method ALL', () => {
    const route1 = new Router();
    const req1 = new Requester(
      new Request('https://example.com/api/users', { method: 'GET' })
    );
    route1.all('/api/users', () => {
      const { res } = route1;
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
    route1.get('/api/users/:id/email/:email', () => {
      const { res } = route1;
      res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
  });

  it('should return true if one of the handlers can handle it', async () => {
    const router = new Router();
    const home = new Route('/');
    const aPage = new Route('/a-page');
    aPage.get(() => aPage.res.send('This is a Page'));

    const req_home = await Requester.fromRequest(
      new Request('https://example.com/')
    );
    const req_page = await Requester.fromRequest(
      new Request('https://example.com/a-page')
    );
    home.get(() => home.res.send('This is home'));
    expect(home.canHandle(req_home)).toBe(true);

    expect(router.canHandle(req_home)).toBe(false);
    expect(router.canHandle(req_page)).toBe(false);

    router.use(home);
    expect(router.canHandle(req_home)).toBe(true);
    expect(router.canHandle(req_page)).toBe(false);

    router.use(aPage);

    expect(router.canHandle(req_home)).toBe(true);
    expect(router.canHandle(req_page)).toBe(true);
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
    route1.get('/api/users/:id/email/:email', () => {
      const { res } = route1;
      res.send('Method for All');
    });
    expect(route1.canHandle(req1)).toStrictEqual(true);
    const res = new ResponseFactory('example.com');
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
    const reser1 = new ResponseFactory('www.example.com');
    const reser2 = new ResponseFactory('www.example.com');
    const reser3 = new ResponseFactory('www.example.com');

    route2.get('/', () => {
      route2.res.send('Hello World');
    });

    route2.get('/user/:id', () => {
      route2.res.send(route2.req.params.id);
    });

    route2.get('/users', () => {
      route2.res.send('users here');
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
    router.get('*', () => {
      const { res } = router;
      res.status(402).send(msg);
    });

    router.get('/', () => {
      const { res } = router;
      res.send('home');
    });

    //console.dir(router);
    const responder = new ResponseFactory('example.com');
    const responder1 = new ResponseFactory('example.com');
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

describe('destructuring req, res, body, etc...', () => {
  it('should be able to extract req, res, body, data, params, query, cookies from router', async () => {
    const request = new Request('https://example.com/home');
    const reqer = await Requester.fromRequest(request);
    const resf = new ResponseFactory(reqer.url.hostname);

    const router = new Router();

    router.get('/:pageName/', () => {
      const { params, res } = router;
      res.send(params.pageName);
    });

    expect(router.canHandle(reqer)).toBe(true);

    await router.tryToHandle(reqer, resf);

    expect(resf.isDone).toBe(true);

    expect(await resf.response.text()).toBe('home');
  });
});
