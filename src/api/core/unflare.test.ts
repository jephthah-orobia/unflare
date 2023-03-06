import { describe, it, expect } from 'vitest';
import { NextFunction } from '../interfaces/middleware';
import { Requester } from './requester';
import { Responder } from './responder';
import { Unflare } from './unflare';

describe('Node/Environment/Engine Assumptions', () => {
  it('An async function will finish when all running functions inside it finishes', async () => {
    type callback = (
      obj: { body: string },
      next: () => void | Promise<void>
    ) => void;

    const fns: callback[] = [
      async (obj: { body: string }, next: () => void | Promise<void>) => {
        obj.body = `fn${index}`;
        next();
      },
      async (obj: { body: string }, next: () => void | Promise<void>) => {
        obj.body = `fn${index}`;
        next();
      },
      async (obj: { body: string }, next: () => void | Promise<void>) => {
        obj.body = `fn${index}`;
        next();
      },
      async (obj: { body: string }, next: () => void | Promise<void>) => {
        obj.body = `fn${index}`;
        next();
      },
      (obj: { body: string }, next: () => void | Promise<void>) => {
        obj.body = `fn${index}`;
        next();
      },
      (obj: { body: string }, next: () => void | Promise<void>) => {
        obj.body = `fn${index}`;
        next();
      },
    ];

    let index: number = -1;
    const next = async () => {
      if (fns.length > index + 1) await fns[++index](obj, next);
      else {
        obj.body = 'done';
        return;
      }
    };

    const obj = { body: 'Original Body' };

    const asynfn = async () => {
      obj.body = 'initialized';
      await next();
    };

    await asynfn();

    expect(obj.body).toStrictEqual('done');
  });
});

describe('fetch()', () => {
  it('should return a response body when called', async () => {
    const app = new Unflare();
    const req = new Request('https://www.example.com', { method: 'GET' });
    const req1 = new Request('https://www.example.com/user/keeser', {
      method: 'GET',
    });
    const req2 = new Request('https://www.example.com/users', {
      method: 'GET',
    });

    app.get('/', (req: Requester, res: Responder) => {
      res.send('Hello World');
    });

    app.get('/user/:id', (re: Requester, res: Responder) => {
      res.send(re.params.id);
    });

    app.get('/users', (req: Requester, res: Responder) => {
      res.send('users here');
    });

    const res = await app.fetch(req);
    const res1 = await app.fetch(req1);
    const res2 = await app.fetch(req2);

    expect(res).toBeDefined();
    expect(res1).toBeDefined();
    expect(res2).toBeDefined();
    expect(await res.text()).toStrictEqual('Hello World');
    expect(await res1.text()).toStrictEqual('keeser');
    expect(await res2.text()).toStrictEqual('users here');
  });

  it('should delegate errors to handlers if there is any', async () => {
    const app = new Unflare();

    const errorHandler = (
      err: any,
      req: Requester,
      res: Responder,
      next: NextFunction
    ) => {
      res.status(403).send('I handled this! ' + err);
    };

    app.get('/a-page-that-throws-an-error', (req, res) => {
      throw new Error('This page throws an error!');
    });

    app.all('*', (req, res) => {
      throw new Error('Not Found!');
    });

    app.use(errorHandler);

    const req = new Request('https://ex.com/a-page-that-throws-an-error');
    const req1 = new Request('https://ex.com/a-page-that-does-not-exist');
    const res = await app.fetch(req);

    const res1 = await app.fetch(req1);

    expect(res).toBeDefined();
    expect(res.status).toBe(403);
    expect(await res.text()).toBe(
      'I handled this! Error: This page throws an error!'
    );

    expect(app.canHandle(new Requester(req1))).toBe(true);
    expect(res1).toBeDefined();
    expect(res1.status).toBe(403);
    expect(await res1.text()).toBe('I handled this! Error: Not Found!');
  });
});
