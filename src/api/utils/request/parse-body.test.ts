import { describe, expect, it } from 'vitest';
import { parseBody } from './parse-body';
import mime from 'mime-types';

describe('parseBody', () => {
  it('should return null if stream is empty', async () => {
    const req = new Request('https://example.com/users', {
      method: 'GET',
    });
    const result = await parseBody(req);
    expect(result).not.toBe({});
    expect(result).toBeNull();
  });

  it('should return a string if the stream is a text/*', async () => {
    const req = new Request('https://example.com/users', {
      method: 'POST',
      body: 'abc123',
    });

    const encoder = new TextEncoder();
    req.headers.set('Content-Type', 'text/plain');
    req.headers.set(
      'Content-Length',
      encoder.encode('abc123').length.toString()
    );
    const body = await parseBody(req);
    expect(typeof body === 'string').toStrictEqual(true);
    expect(body).toStrictEqual('abc123');
  });

  it('should return an object if the stream is an application/json', async () => {
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

    expect(await parseBody(req)).toStrictEqual(obj);
  });

  it('should return an object if the stream is an application/x-www-form-urlencoded', async () => {
    const obj = { email: 'test@test.test', password: 'Abc123' };
    const bod = new URLSearchParams(obj).toString();
    const req = new Request('https://example.com/users', {
      method: 'POST',
      body: bod,
    });

    const encoder = new TextEncoder();
    req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    req.headers.set('Content-Length', encoder.encode(bod).length.toString());
    const body = await parseBody(req);
    expect(body).toHaveProperty('email');
    expect(body.email).toStrictEqual(obj.email);
    expect(body).toHaveProperty('password');
    expect(body.password).toStrictEqual(obj.password);
  });

  it('should return a Uint8array object if the stream is of other types', async () => {
    const obj = { email: 'test@test.test', password: 'Abc123' };
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(obj));
    const req = new Request('https://example.com/users', {
      method: 'POST',
      body: data,
    });

    req.headers.set('Content-Length', data.length.toString());
    const body = await parseBody(req);
    expect(typeof body).toStrictEqual('object');
    expect(body instanceof Uint8Array).toStrictEqual(true);
    expect(body[3]).toStrictEqual(encoder.encode(JSON.stringify(obj))[3]);
    expect(body[5]).toStrictEqual(encoder.encode(JSON.stringify(obj))[5]);
    expect(body[7]).toStrictEqual(encoder.encode(JSON.stringify(obj))[7]);
  });
});
