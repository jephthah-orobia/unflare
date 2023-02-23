import { describe, it, expect } from 'vitest';
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

describe('listen()', () => {
  it('should attach the unflare instance as default export of the module', () => {
    const app = new Unflare();
    app.listen(module);
    expect(module.exports.default).toStrictEqual(app);
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

    expect(await (await app.fetch(req)).text()).toStrictEqual('Hello World');
    expect(await (await app.fetch(req2)).text()).toStrictEqual('users here');
    expect(await (await app.fetch(req1)).text()).toStrictEqual('keeser');
  });
});
