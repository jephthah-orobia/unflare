import { describe, it, expect } from 'vitest';
import { HTTPVerbs } from '../enums/http-verbs';
import { Requester } from './requester';

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
});
