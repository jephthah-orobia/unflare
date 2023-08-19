import { describe, it, expect, vi } from 'vitest';
import { Unflare } from './unflare';
import { RequestInspector } from './request-inspector';

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

    app.get('/', () => {
      app.res.send('Hello World');
    });

    app.get('/user/:id', () => {
      const { req, res } = app;
      res.send(req.params.id);
    });

    app.get('/users', () => {
      app.res.send('users here');
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

    app.get('/a-page-that-throws-an-error', () => {
      throw new Error('This page throws an error!');
    });

    app.all('*', () => {
      throw new Error('Not Found!');
    });

    app.use((ap: Unflare, err: any) => {
      ap.res.status(403).send('I handled this! ' + err);
    });

    //@ts-ignore
    expect(app.errorHandlers.length).toBe(1);
    //@ts-ignore
    const req = new Request('https://ex.com/a-page-that-throws-an-error');
    const req1 = new Request('https://ex.com/a-page-that-does-not-exist');
    const res = await app.fetch(req);

    const res1 = await app.fetch(req1);

    expect(res).toBeDefined();
    expect(res.status).toBe(403);
    expect(await res.text()).toBe(
      'I handled this! Error: This page throws an error!'
    );

    expect(app.canHandle(new RequestInspector(req1))).toBe(true);
    expect(res1).toBeDefined();
    expect(res1.status).toBe(403);
    expect(await res1.text()).toBe('I handled this! Error: Not Found!');
  });
});

describe('.beforeEach() and .afterEach()', () => {
  it('should call added hooks on right timing', async () => {
    const app = new Unflare();
    const preHook = vi.fn(() => {
      sequence += '0';
    });

    const asyncPreHook = vi.fn(async () => (sequence += 'a'));

    const postHook = vi.fn(() => {
      sequence += '2';
    });
    const asyncPostHook = vi.fn(async () => (sequence += 'b'));

    let sequence = '';
    app.get('/', () => {
      sequence += '1';
      app.res.send('home!');
    });

    app.get('/reset', () => {
      sequence = '---';
      app.res.status(201).send('reset!');
    });

    app.beforeEach(preHook); // 0
    app.beforeEach(preHook, asyncPreHook); // 00a
    app.beforeEach(preHook, asyncPreHook, preHook); // 00a0a0
    expect(preHook).not.toHaveBeenCalled(); // check that the prehook is not called during addition;
    expect(asyncPreHook).not.toHaveBeenCalled(); // check that the prehook is not called during addition;

    app.afterEach(postHook); // 00a0a012
    app.afterEach(postHook, asyncPostHook); // 00a0a0122b
    app.afterEach(postHook, asyncPostHook, postHook); // 00a0a0a122b2b2
    expect(postHook).not.toHaveBeenCalled(); // check that the prehook is not called during addition;
    expect(asyncPostHook).not.toHaveBeenCalled(); // check that the prehook is not called during addition;

    const req_home = new Request('https://example.com/', { method: 'GET' });
    const req_reset = new Request('https://example.com/reset', {
      method: 'GET',
    });

    const res_home = await app.fetch(req_home);

    expect(res_home.status).toBe(200);
    expect(await res_home.text()).toBe('home!');

    expect(preHook).toHaveBeenCalledTimes(4);
    expect(asyncPreHook).toHaveBeenCalledTimes(2);
    expect(postHook).toHaveBeenCalledTimes(4);
    expect(asyncPostHook).toHaveBeenCalledTimes(2);

    expect(sequence).toBe('00a0a0122b2b2');

    const res_reset = await app.fetch(req_reset);

    expect(res_reset.status).toBe(201);
    expect(await res_reset.text()).toBe('reset!');

    expect(preHook).toHaveBeenCalledTimes(8);
    expect(asyncPreHook).toHaveBeenCalledTimes(4);
    expect(postHook).toHaveBeenCalledTimes(8);
    expect(asyncPostHook).toHaveBeenCalledTimes(4);

    expect(sequence).toBe('---22b2b2');
  });
});
