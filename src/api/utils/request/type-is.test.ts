import { describe, it, expect } from 'vitest';
import { typeIs } from './type-is';
import mime from 'mime-types';

describe('typeIs()', () => {
  it('should return false for request that do not have content-type', () => {
    expect(
      typeIs(
        new Request('https://example.com/api/users', { method: 'GET' }),
        /text/i
      )
    ).toStrictEqual(false);
  });

  it('should return true for request that matches the types specified', () => {
    const req = new Request('https://example.com/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test.test@test.test' }),
    });
    req.headers.set('Content-Type', mime.contentType('json') as string);
    expect(typeIs(req, /^application\/json/)).toStrictEqual(true);
  });
});
