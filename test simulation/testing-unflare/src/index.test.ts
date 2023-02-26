import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { serialize } from 'cookie';

describe('Worker', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  describe('get: /', () => {
    it('should return a signin page for / if not signed in.', async () => {
      const resp = await worker.fetch();
      if (resp) {
        const text = await resp.text();
        expect(/\<form action=\"\/users\"/.test(text)).toBe(true);
      } else {
        expect.fail();
      }
    });

    it('should return a welcome `user` if signed in with a signout button', async () => {
      const { cookie } = cookieOfSignIn('John');
      const headers = new Headers();
      headers.set('Cookie', cookie);
      const resp = await worker.fetch('/', { method: 'GET', headers });
      if (resp) {
        const text = await resp.text();
        expect(/Welcome John/im.test(text)).toBe(true);
        expect(/\<form action=\"\/signout\"/.test(text)).toBe(true);
      } else {
        expect.fail();
      }
    });
  });

  describe('post: /users', () => {
    it("will return a 'Set-Cookie' header that holds value for user and redirect to '/'", async () => {
      const { cookie, id } = cookieOfSignIn('John');
      const formdata = new URLSearchParams({ name: 'John', id });
      const reqInit = {
        method: 'POST',
        body: formdata.toString(),
        headers: new Headers(),
      };
      reqInit.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      const resp = await worker.fetch('/users', reqInit);
      if (resp) {
        const url = new URL(resp.url);
        expect(url.pathname).toBe('/');
        expect(resp.redirected).toBe(true);
      } else {
        expect.fail();
      }
    });
  });

  describe('get: /signout', () => {
    it("should return a header with blank value for Set-Cookie then redirect with status code 302 to '/'", async () => {
      const res = await worker.fetch('/signout');
      if (res) {
        const url = new URL(res.url);
        expect(url.pathname).toBe('/');
        expect(res.redirected).toBe(true);
      } else {
        expect.fail();
      }
    });
  });
});

const cookieOfSignIn = (
  userName: string,
  id: string | null = null
): { cookie: string; id: string } => {
  id = id || crypto.randomUUID();
  return {
    cookie: serialize('user', JSON.stringify({ name: userName, id: id })),
    id,
  };
};
