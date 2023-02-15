import { describe, expect, it } from 'vitest';
import { urlIsPath } from './url-is-path';

describe('urlIsPath() test', () => {
  it('Correctly evaluatets paths for regular paths without patterns', () => {
    expect(urlIsPath('http://localhost/', 'localhost', '/')).toStrictEqual(
      true
    );
    expect(
      urlIsPath('http://localhost/', 'localhost', '/asdgha')
    ).toStrictEqual(false);
    expect(
      urlIsPath('http://localhost/user/api', 'localhost', '/asdgha')
    ).toStrictEqual(false);
    expect(
      urlIsPath('http://localhost/user/api', 'localhost', '/user/api')
    ).toStrictEqual(true);
    expect(
      urlIsPath('http://localhost/user/api', 'localhost', 'user/api')
    ).toStrictEqual(true);
    expect(
      urlIsPath('http://localhost/user/api', 'localhost', 'user/api/')
    ).toStrictEqual(true);
    expect(
      urlIsPath('http://localhost/user/api', 'localhost', '/user/api/')
    ).toStrictEqual(true);
  });

  it('Correctly evaluate path with params', () => {
    expect(
      urlIsPath(
        'https://localhost.dev/user/api/',
        'localhost.dev',
        '/user/api/:id'
      )
    ).toBe(false);

    expect(
      urlIsPath(
        'https://localhost.dev/user/api/1245123',
        'localhost.dev',
        '/user/api/:id'
      )
    ).toBe(true);

    expect(
      urlIsPath(
        'https://localhost.dev/user/api/1245123',
        'localhost.dev',
        '/user/api/:id/'
      )
    ).toBe(true);
  });

  it('Correctly evaluate path with multiple params', () => {
    expect(
      urlIsPath(
        'https://localhost.dev/user/api/12341545/username',
        'localhost.dev',
        '/user/api/:id/username/:name'
      )
    ).toBe(false);
    expect(
      urlIsPath(
        'https://localhost.dev/user/api/1245123/email/sirjep.asgda',
        'localhost.dev',
        '/user/api/:id/email/:email'
      )
    ).toBe(true);
    expect(
      urlIsPath(
        'https://localhost.dev/user/api/1245123/email/sirjep.asgda',
        'localhost.dev',
        '/user/api/:id/:key/:email'
      )
    ).toBe(true);
  });
});
