import { describe, it, expect } from 'vitest';
import { getParams } from './get-params';
import { pathToRegExp } from './param-patterns';
import { normalizePath } from '../path/match-path';

describe('getParams()', () => {
  it('should return an empty object if there is no params in patterns', () => {
    expect(getParams('/api/users', '/api/users')).toStrictEqual({});
  });

  it('should return an empty object if path and pathPattern do not match', () => {
    expect(getParams('/api/users', '/api/users')).toStrictEqual({});
  });

  it('shoule return the correct params with correct keys', () => {
    const para = getParams('/home', '/:page');
    expect(para).toBeDefined();
    expect(para.page).toBeDefined();
    expect(para).toHaveProperty('page');
    expect(para.page).toStrictEqual('home');

    const params = getParams('/api/users/124121', '/api/users/:id');

    expect(params).toBeDefined();
    expect(params).toHaveProperty('id');
    expect(params.id).toBeDefined();
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
