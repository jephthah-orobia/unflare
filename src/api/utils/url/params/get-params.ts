import { pathToRegExp, urlParamKeysPattern } from './param-patterns';
import { normalizePath } from '../path/match-path';

/**
 * Extract params from a path.
 * ie:
 * ```js
 * const params = urlIsPath(
 *    '/api/users/1212315412/email/test@test.test',
 *    '/api/users/:id/email/:email');
 *
 * console.log([params]) // {id: '1212315412', email: 'test@test.test'}
 * ```
 * @param path the path that contains params value.
 * @param pathPattern the path that contains params identifiers.
 * @returns An object with params set as properties.
 */
export const getParams = (
  path: string,
  pathPattern: string
): { [index: string]: string } => {
  const params: { [index: string]: string } = {};

  // trim `/`
  path = normalizePath(path);
  pathPattern = normalizePath(pathPattern);

  // extract the name of the params
  const keys = pathPattern.match(urlParamKeysPattern)?.map((v) => v);

  // generate RegExp obj
  const pathPatternRX = pathToRegExp(pathPattern);

  // extract the values of the params
  const values = path
    .match(pathPatternRX)
    ?.map((e) => e)
    ?.filter((e) => e !== path);

  // check if there is any valid params or if the params set in path is matched with params in pattern.
  if (
    !pathPatternRX.test(path) ||
    !keys ||
    !values ||
    keys.length !== values.length
  )
    return params;

  // populate params.
  for (let i = 0; i < keys.length; i++) params[keys[i]] = values[i];

  return params;
};
