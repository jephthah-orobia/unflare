import { describe, expect, it } from 'vitest';
import { normalizePath, matchPath } from './match-path';

describe('normalizePath() test', () => {
  it('should trim paths correctly', () => {
    expect(normalizePath('/api/users/1231/email/test@test.test')).toStrictEqual(
      'api/users/1231/email/test@test.test'
    );
    expect(normalizePath('api/users/1231/email/test@test.test/')).toStrictEqual(
      'api/users/1231/email/test@test.test'
    );
    expect(normalizePath('api/users/1231/email/test@test.test')).toStrictEqual(
      'api/users/1231/email/test@test.test'
    );

    expect(normalizePath('/api/users/:id/email/:email')).toStrictEqual(
      'api/users/:id/email/:email'
    );
    expect(normalizePath('api/users/:id/email/:email/')).toStrictEqual(
      'api/users/:id/email/:email'
    );
    expect(normalizePath('api/users/:id/email/:email')).toStrictEqual(
      'api/users/:id/email/:email'
    );
  });
});

describe('matchPath() test', () => {
  it('Correctly evaluatets paths for regular paths without patterns', () => {
    expect(matchPath('/', '/')).toStrictEqual(true);
    expect(matchPath('/', '/asdgha')).toStrictEqual(false);
    expect(matchPath('/user/api', '/asdgha')).toStrictEqual(false);
    expect(matchPath('/user/api', '/user/api')).toStrictEqual(true);
    expect(matchPath('/user/api', 'user/api')).toStrictEqual(true);
    expect(matchPath('/user/api', 'user/api/')).toStrictEqual(true);
    expect(matchPath('/user/api', '/user/api/')).toStrictEqual(true);
  });

  it('Correctly evaluate path with params', () => {
    expect(matchPath('/home', '/:pageName')).toBe(true);
    
    expect(matchPath('/user/api/', '/user/api/:id')).toBe(false);

    expect(matchPath('/user/api/1245123', '/user/api/:id')).toBe(true);

    expect(matchPath('/user/api/1245123', '/user/api/:id/')).toBe(true);
  });

  it('Correctly evaluate path with multiple params', () => {
    expect(
      matchPath('/user/api/12341545/username', '/user/api/:id/username/:name')
    ).toBe(false);
    expect(
      matchPath(
        '/user/api/1245123/email/sirjep.asgda',
        '/user/api/:id/email/:email'
      )
    ).toBe(true);
    expect(
      matchPath(
        '/user/api/1245123/email/sirjep.asgda',
        '/user/api/:id/:key/:email'
      )
    ).toBe(true);
  });
  it('should return true when a wildcard is used', () => {
    const pattern = '*';
    expect(matchPath('/', pattern)).toBe(true);
    expect(matchPath('', pattern)).toBe(true);
    expect(matchPath('/anypath', pattern)).toBe(true);
    expect(matchPath('/any-path', pattern)).toBe(true);
    expect(matchPath('/any-path123.soda', pattern)).toBe(true);
    expect(matchPath('/any-path123.soda', pattern, true)).toBe(true);
    expect(matchPath('/any-path123.soda', pattern, false)).toBe(true);
  });
  it('should return appropriately when a wildcard is used', () => {
    const pattern = '/somepath/*';
    expect(matchPath('/anotherpath', pattern)).toBe(false);
    expect(matchPath('/somepath', pattern)).toBe(true);
    expect(matchPath('/somepath/', pattern)).toBe(true);
    expect(matchPath('/somepath/asdf`', pattern)).toBe(true);
    expect(matchPath('/somepath/asd.fa/sasd12fa', pattern, true)).toBe(true);
    expect(matchPath('/somepath/asd.fa/sasd12fa', pattern, false)).toBe(true);
    const pattern1 = '/somepath*';
    expect(matchPath('/anotherpath', pattern1)).toBe(false);
    expect(matchPath('/somepath', pattern1)).toBe(true);
    expect(matchPath('/somepath/', pattern1)).toBe(true);
    expect(matchPath('/somepath/asdf`', pattern1)).toBe(true);
    expect(matchPath('/somepath/asd.fa/sasd12fa', pattern1, true)).toBe(true);
    expect(matchPath('/somepath/asd.fa/sasd12fa', pattern1, false)).toBe(true);
  });
});

describe('matchPath(string, RegExp)', () => {
  const pattern = /\/api\/users\/(\d+)/i;
  it('should return false when path fails RegExp test', () => {
    expect(matchPath('/api/users', pattern)).toStrictEqual(false);
  });
  it('should return true when path passes the RegExp test', () => {
    expect(matchPath('/api/users/123', pattern)).toStrictEqual(true);
  });
  it('should return true when a wildcard is used', () => {
    const wildcard_pattern = /.*/;
    expect(matchPath('', wildcard_pattern)).toBe(true);
    expect(matchPath('/', wildcard_pattern)).toBe(true);
    expect(matchPath('/anypath', wildcard_pattern)).toBe(true);
    expect(matchPath('/any-path', wildcard_pattern)).toBe(true);
    expect(matchPath('/any-path123.soda', wildcard_pattern)).toBe(true);
    expect(matchPath('/any-path123.soda', wildcard_pattern, true)).toBe(true);
    expect(matchPath('/any-path123.soda', wildcard_pattern, false)).toBe(true);
    expect(matchPath('/any-pat/h123/.soda', wildcard_pattern, false)).toBe(
      true
    );
  });
});
