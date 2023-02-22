import { describe, expect, it } from 'vitest';
import { HTTPVerbs } from '../enums/http-verbs';
import { Requester } from './requester';
import { Responder } from './responder';
import { Router } from './router';

describe('Assumptions', () => {
  it('iterating on enum', () => {
    const methods = [];
    for (const verb in HTTPVerbs) methods.push(verb);
    expect(methods.every((e) => typeof e == 'string')).toBeTruthy();
    expect(methods.includes(HTTPVerbs.ALL)).toBeTruthy();
    expect(methods.includes(HTTPVerbs.GET)).toBeTruthy();
    expect(methods.includes(HTTPVerbs.CONNECT)).toBeTruthy();
  });
});

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

describe('Router::handle()', () => {
  it('should set the params property of the requester and set the isDone property of the responder given valid handlers', () => {
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
    expect(() => route1.handle(req1, res)).not.toThrowError();
    expect(req1.params).toStrictEqual({ id: '1234', email: 'test@test.test' });
    expect(res.isDone).toStrictEqual(true);
  });
});
