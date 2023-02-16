import { describe, it, expect } from 'vitest';
import { parseQuery } from './parse-query';

describe('parseQuery() test', () => {
  it('empty query string should return an empty object', () => {
    const result = parseQuery('');
    expect(result).toBeTypeOf('object');
    let hasProperty = false;
    for (let key in result) {
      hasProperty = true;
      break;
    }
    expect(hasProperty).toBe(false);
  });

  it('returns an empty array for strings with no key=value', () => {
    expect(parseQuery('anbasdfzx?ajgasssd00')).toStrictEqual({});
  });

  it('should strictly return {foo: "bar"} for "foo=bar"', () => {
    // 'foo=bar' should return {foo: 'bar'}
    const queryOnly = parseQuery('foo=bar');
    expect(queryOnly).toStrictEqual({ foo: 'bar' });
    // make sure only one property is defined
    let queryOnly_propertycount = 0;
    for (let key in queryOnly) queryOnly_propertycount++;
    expect(queryOnly_propertycount).toBe(1);
  });

  it('should return the object with the correct number of properties', () => {
    // a query string with 3 key=value
    const result3 = parseQuery('foo=bar&id=12512315&some=thing');
    expect(result3).toBeDefined;
    let result3_propertycount = 0;
    for (let key in result3) result3_propertycount++;
    expect(result3_propertycount).toBe(3);
    //@ts-ignore
    expect(result3.foo).toBe('bar');
    // a query string with 5 key=value with some using htmp entities
    const result5 = parseQuery(
      'foo=bar&id=12512315&some=thing&sidg=sdfag&#33;sdg=amp&amp;sg'
    );
    expect(result5).toBeDefined;
    let result5_propertycount = 0;
    for (let key in result5) result5_propertycount++;
    expect(result5_propertycount).toBe(5);
  });

  it('should also parse full urls and queryString that starts with ?', () => {
    const fullUrl = parseQuery(
      'https://www.google.com/search?q=passport%20renewal&source=hp&ei=xTnsY7X9Ktfj2roP946-OA&iflsig=AK50M_UAAAAAY-xH1SQ_Pg_Uz7Gp_HMgQ5m_FSvxiG9_&oq=&gs_lcp=Cgdnd3Mtd2l6EAEYAzIOCAAQ6gIQtAIQ2QIQ5QIyDggAEOoCELQCENkCEOUCMg4IABDqAhC0AhDZAhDlAjIOCAAQ6gIQtAIQ2QIQ5QIyDggAEOoCELQCENkCEOUCMg4IABDqAhC0AhDZAhDlAjIOCAAQ6gIQtAIQ2QIQ5QIyDggAEOoCELQCENkCEOUCMggIABCPARDqAjIICC4QjwEQ6gJQAFgAYOGUAWgCcAB4AIABAIgBAJIBAJgBALABCg&sclient=gws-wiz'
    );
    expect(fullUrl).toBeDefined;
    //@ts-ignore
    expect(fullUrl.q).toBe('passport renewal');
    let fullUrl_propertycount = 0;
    for (let key in fullUrl) fullUrl_propertycount++;
    expect(fullUrl_propertycount).toBe(7);

    const startWithQ = parseQuery(
      '?foo=bar&id=12512315&some=thing&sidg=sdfag&#33;sdg=amp&amp;sg'
    );
    expect(startWithQ).toBeDefined;
    let startWithQ_propertycount = 0;
    for (let key in startWithQ) startWithQ_propertycount++;
    expect(startWithQ_propertycount).toBe(5);
  });

  it('should correctly parse URL inputs', () => {
    const url = new URL('https://example.com/?name=Jonathan%20Smith&age=18');
    expect(parseQuery(url)).toStrictEqual({
      age: '18',
      name: 'Jonathan Smith',
    });
  });
});
