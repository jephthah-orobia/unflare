import { describe, expect, it } from 'vitest';
import { urlIsPath } from './url-is-path';

describe('urlIsPath() test', () => {
  it('Correctly evaluatets paths for regular paths without patterns', () => {
    expect(urlIsPath('/', '/')).toStrictEqual(true);
    expect(urlIsPath('/', '/asdgha')).toStrictEqual(false);
    expect(urlIsPath('/user/api', '/asdgha')).toStrictEqual(false);
    expect(urlIsPath('/user/api', '/user/api')).toStrictEqual(true);
    expect(urlIsPath('/user/api', 'user/api')).toStrictEqual(true);
    expect(urlIsPath('/user/api', 'user/api/')).toStrictEqual(true);
    expect(urlIsPath('/user/api', '/user/api/')).toStrictEqual(true);
  });

  it('Correctly evaluate path with params', () => {
    expect(urlIsPath('/user/api/', '/user/api/:id')).toBe(false);

    expect(urlIsPath('/user/api/1245123', '/user/api/:id')).toBe(true);

    expect(urlIsPath('/user/api/1245123', '/user/api/:id/')).toBe(true);
  });

  it('Correctly evaluate path with multiple params', () => {
    expect(
      urlIsPath('/user/api/12341545/username', '/user/api/:id/username/:name')
    ).toBe(false);
    expect(
      urlIsPath(
        '/user/api/1245123/email/sirjep.asgda',
        '/user/api/:id/email/:email'
      )
    ).toBe(true);
    expect(
      urlIsPath(
        '/user/api/1245123/email/sirjep.asgda',
        '/user/api/:id/:key/:email'
      )
    ).toBe(true);
  });
});
