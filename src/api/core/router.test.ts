import { describe, expect, it } from 'vitest';
import { HTTPVerbs } from '../enums/http-verbs';
import { Router } from './router';

describe('Assumptions', () => {
  it('iterating on enum', () => {
    const methods = [];
    for (const verb in HTTPVerbs) methods.push(verb);
    expect(methods.every((e) => typeof e == 'string')).toBeTruthy();
    expect(methods.includes(HTTPVerbs.ALL)).toBeTruthy();
    expect(methods.includes(HTTPVerbs.GET)).toBeTruthy();
    expect(methods.includes(HTTPVerbs.CONNECT)).toBeTruthy();
  });
});

describe('Router', () => {
  it('Property test', () => {
    const router = new Router();
    return;
    expect(router).toHaveProperty('use');
    expect(router).toHaveProperty('any');
    expect(router).toHaveProperty('get');
    expect(router).toHaveProperty('head');
    expect(router).toHaveProperty('post');
    expect(router).toHaveProperty('put');
    expect(router).toHaveProperty('delete');
    expect(router).toHaveProperty('connect');
    expect(router).toHaveProperty('options');
    expect(router).toHaveProperty('patch');
  });

  it('use Test', () => {
    const router1 = new Router();

    const router2 = new Router();
  });
});
