import { describe, it, expect } from 'vitest';
import { HTTPVerbs, stringToHTTPVerbs } from './http-verbs';

describe('HTTPVerbs test', () => {
  it('should return the correct HTTPVerbs for each string', () => {
    expect(stringToHTTPVerbs('get')).toStrictEqual(HTTPVerbs.GET);
    expect(stringToHTTPVerbs('GET')).toStrictEqual(HTTPVerbs.GET);
    expect(stringToHTTPVerbs('head')).toStrictEqual(HTTPVerbs.HEAD);
    expect(stringToHTTPVerbs('HEAD')).toStrictEqual(HTTPVerbs.HEAD);
    expect(stringToHTTPVerbs('post')).toStrictEqual(HTTPVerbs.POST);
    expect(stringToHTTPVerbs('POST')).toStrictEqual(HTTPVerbs.POST);
    expect(stringToHTTPVerbs('put')).toStrictEqual(HTTPVerbs.PUT);
    expect(stringToHTTPVerbs('PUT')).toStrictEqual(HTTPVerbs.PUT);
    expect(stringToHTTPVerbs('patch')).toStrictEqual(HTTPVerbs.PATCH);
    expect(stringToHTTPVerbs('PATCH')).toStrictEqual(HTTPVerbs.PATCH);
    expect(stringToHTTPVerbs('delete')).toStrictEqual(HTTPVerbs.DELETE);
    expect(stringToHTTPVerbs('DELETE')).toStrictEqual(HTTPVerbs.DELETE);
    expect(stringToHTTPVerbs('connect')).toStrictEqual(HTTPVerbs.CONNECT);
    expect(stringToHTTPVerbs('CONNECT')).toStrictEqual(HTTPVerbs.CONNECT);
    expect(stringToHTTPVerbs('options')).toStrictEqual(HTTPVerbs.OPTIONS);
    expect(stringToHTTPVerbs('OPTIONS')).toStrictEqual(HTTPVerbs.OPTIONS);
    expect(stringToHTTPVerbs('trace')).toStrictEqual(HTTPVerbs.TRACE);
    expect(stringToHTTPVerbs('TRACE')).toStrictEqual(HTTPVerbs.TRACE);
  });
});
