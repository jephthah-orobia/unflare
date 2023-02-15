import { describe, it, expect } from 'vitest';
import {
  getParams,
  urlParamKeysPattern,
  urlParamKeysWithColonPattern,
  urlParamPattern,
} from './get-params';

describe('urlParamKeysPattern', () => {
  it('should fail .test on url with no valid param identifier', () => {
    const invalid = '/api/test';
    expect(urlParamKeysPattern.test(invalid)).toStrictEqual(false);

    const invalid1 = '/api/test/:123154asds';
    expect(urlParamKeysPattern.test(invalid1)).toStrictEqual(false);
  });

  it('should recognize all params in a url', () => {
    const url = '/api/users/:id/useremail/:email';
    expect(urlParamKeysPattern.test(url)).toStrictEqual(true);

    const result = url.match(urlParamKeysPattern)?.map((val) => val);
    expect(result).toStrictEqual(['id', 'email']);

    const url1 = '/api/:apiName/:id/:somePars/page/:1i3e';
    expect(urlParamKeysPattern.test(url1)).toStrictEqual(true);

    const result1 = url1.match(urlParamKeysPattern)?.map((val) => val);
    expect(result1).toStrictEqual(['apiName', 'id', 'somePars']);
  });
});

describe('urlParamKeysWithColonPattern', () => {
  it('should fail .test on url with no valid param identifier', () => {
    const invalid = '/api/test';
    expect(urlParamKeysWithColonPattern.test(invalid)).toStrictEqual(false);

    const invalid1 = '/api/test/:123154asds';
    expect(urlParamKeysWithColonPattern.test(invalid1)).toStrictEqual(false);
  });

  it('should recognize all params in a url (including the colon)', () => {
    const url = '/api/users/:id/useremail/:email';
    expect(urlParamKeysWithColonPattern.test(url)).toStrictEqual(true);

    const result = url.match(urlParamKeysWithColonPattern)?.map((val) => val);
    expect(result).toStrictEqual([':id', ':email']);

    const url1 = '/api/:apiName/:id/:somePars/page/:1i3e';
    expect(urlParamKeysWithColonPattern.test(url1)).toStrictEqual(true);

    const result1 = url1.match(urlParamKeysWithColonPattern)?.map((val) => val);
    expect(result1).toStrictEqual([':apiName', ':id', ':somePars']);
  });
});

describe('urlParamPattern', () => {
  it('should correctly follow the routing', () => {
    const path = '/api/users/124121/jhep';
    let pattern = '/api/users/:id/:username';
    pattern = pattern.replaceAll('/', '\\/');
    pattern = pattern.replaceAll(
      urlParamKeysWithColonPattern,
      urlParamPattern.source
    );
    const result = path.match(pattern)?.map((v) => v);
    expect(result).toStrictEqual([path, '124121', 'jhep']);
  });
});

describe('getParams()', () => {
  it('should return an empty object if there is no params in patterns', () => {
    expect(getParams('/api/users', '/api/users')).toStrictEqual({});
  });

  it('should return an empty object if path and pathPattern do not match', () => {
    expect(getParams('/api/users', '/api/users')).toStrictEqual({});
  });

  it('shoule return the correct params with correct keys', () => {
    const params = getParams('/api/users/124121', '/api/users/:id');

    expect(params).toBeDefined();
    expect(params.id).toBeDefined();
    expect(params).toHaveProperty('id');
    expect(params.id).toStrictEqual('124121');

    const params1 = getParams(
      '/api/users/asg14snaj1/email/test@test.test',
      '/api/users/:id/email/:email'
    );

    expect(params1).toStrictEqual({
      id: 'asg14snaj1',
      email: 'test@test.test',
    });
    expect(params1).toHaveProperty('id');
    expect(params1).toHaveProperty('email');
    expect(params1.id).toStrictEqual('asg14snaj1');
    expect(params1.email).toStrictEqual('test@test.test');
  });
});
