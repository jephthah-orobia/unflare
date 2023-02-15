import { describe, it, expect } from 'vitest';
import { inspectURL } from './inspect-url';

describe('inspectURL() tests', () => {
  it('throws an error when `host` is not found in the url', () => {
    expect(() => inspectURL('', 'localhost')).toThrowError();
  });

  it('returns an object with properties `query` and `path`', () => {
    expect(inspectURL('', '')).toHaveProperty('query');
    expect(inspectURL('', '')).toHaveProperty('path');
  });

  it('extracts the correct `path` of urls', () => {
    expect(
      inspectURL('https://localhost/api/user', 'localhost').path
    ).toStrictEqual('/api/user');

    expect(
      inspectURL('https://www.website.com/', 'www.website.com').path
    ).toStrictEqual('/');

    expect(
      inspectURL('https://www.website.com/', 'website.com').path
    ).toStrictEqual('/');
  });

  it('extracts the correct `query` and path in urls', () => {
    const { path: res1path, query: res1query } = inspectURL(
      'http://localhost/api/users/123451241512315?prop=image&key=15123a',
      'localhost'
    );

    expect(res1path).toStrictEqual('/api/users/123451241512315');
    expect(res1query).toStrictEqual({
      prop: 'image',
      key: '15123a',
    });

    const { path: res2path, query: res2query } = inspectURL(
      'http://localhost/api/users/?q=&prop=image&key=15123a',
      'localhost'
    );

    expect(res2path).toStrictEqual('/api/users/');
    expect(res2query).toStrictEqual({
      q: null,
      prop: 'image',
      key: '15123a',
    });
  });

  it('correctly parse urls with fragments', () => {
    const { path: res1path, query: res1query } = inspectURL(
      'http://localhost/api/users/123451241512315?prop=image&key=15123a#somes',
      'localhost'
    );

    expect(res1path).toStrictEqual('/api/users/123451241512315');
    expect(res1query).toStrictEqual({
      prop: 'image',
      key: '15123a',
    });
  });
});
