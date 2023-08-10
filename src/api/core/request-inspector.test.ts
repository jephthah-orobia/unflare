import { describe, it, expect } from 'vitest';
import { HTTPVerbs } from '../enums/http-verbs';
import { RequestInspector } from './request-inspector';
import { serialize } from 'cookie';

describe('Requester Class', () => {
  describe('.fromRequest', () => {
    it('should be instantiated correctly when a valid @cloudflare/workers-types::Request is provided', async () => {
      const header = new Headers();
      header.append('host', 'example.com');
      header.append('Content-Type', 'application/json');
      header.append('body', JSON.stringify({ userId: '12412512341' }));
      const req = new Request(
        new URL('https://example.com/api/users?id=keeser&email=test@test.test'),
        {
          method: 'POST',
          headers: header,
        }
      );

      const reqer = await RequestInspector.fromRequest(req);

      expect(reqer).toBeDefined();
      expect(reqer).toHaveProperty('method');
      expect(reqer.method).toStrictEqual(HTTPVerbs.POST);
      expect(reqer.url).toBeDefined();
      expect(reqer.path).toStrictEqual('/api/users');
      expect(reqer.query).toStrictEqual({
        id: 'keeser',
        email: 'test@test.test',
      });
    });

    it('should set body property to the PARSED body of the request if there is any', async () => {
      const obj = { email: 'test@test.test', password: 'Abc123' };

      const req = new Request('https://example.com/users', {
        method: 'POST',
        body: JSON.stringify(obj),
      });

      const encoder = new TextEncoder();
      req.headers.set('Content-Type', 'application/json');
      req.headers.set(
        'Content-Length',
        encoder.encode(JSON.stringify(obj)).length.toString()
      );
      const reqer = await RequestInspector.fromRequest(req);

      expect(reqer).toBeDefined();
      expect(reqer).toHaveProperty('body');
      while (!reqer.body) {}
      expect(reqer.body).toStrictEqual(obj);
    });

    it('should set cookies property to the PARSED cookie from headers', async () => {
      const obj = { user: 'tester', id: 'Abc123' };
      const ser = serialize('user', JSON.stringify(obj));
      const req = new Request('https://example.com/check', {
        method: 'GET',
      });
      req.headers.set('Cookie', ser);
      const reqer = await RequestInspector.fromRequest(req);

      expect(reqer.cookies).toBeDefined();
      expect(reqer.cookies.user).toBe(JSON.stringify(obj));
    });
  });
});
