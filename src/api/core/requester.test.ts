import { describe, it, expect } from 'vitest';
import { HTTPVerbs } from '../enums/http-verbs';
import { Requester } from './requester';
import mime from 'mime-types';

describe('Requester instantiation', () => {
  it('should be instantiated correctly when a valid @cloudflare/workers-types::Request is provided', () => {
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

    const reqer = new Requester(req);

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
    req.headers.set('Content-Type', mime.contentType('json') as string);
    req.headers.set(
      'Content-Length',
      encoder.encode(JSON.stringify(obj)).length.toString()
    );
    const reqer = await Requester.fromRequest(req);

    expect(reqer).toBeDefined();
    expect(reqer).toHaveProperty('body');
    while (!reqer.body) {}
    expect(reqer.body).toStrictEqual(obj);
  });
});
