export const urlParamKeysPattern = /(?<=\/\:)[a-z][a-z\d\_]*/gi;
export const urlParamKeysWithColonPattern = /(?<=\/)\:[a-z][a-z\d\_]*/gi;
export const urlParamPattern = /(?<=\/)([a-z\-\d\%\_\.\~\+\@]+)/i;

/**
 * trims '/' if there are any.
 *
 * In this module, [unflare](https://github.com/jephthah-orobia/unflare), a normal path shouldn't have a slash '/' in the start and end of the path.
 * @param path path to normalize
 * @returns a normalize path.
 */
export const normalizePath = (path: string): string => {
  if (path[0] === '/') path = path.substring(1);
  if (path.at(-1) === '/') path = path.substring(0, path.length - 1);
  return path;
};

/**
 * Generates a regular expression pattern base on given path.
 * @param path a path with param identifiers. ie: /api/users/:id/email/:email
 * @returns a new Regular Expression.
 */
export const pathToRegExp = (path: string): RegExp => {
  // prepare `pathPattern` for constructing a RexExp object
  path = path.replaceAll('/', '\\/');
  path = path.replaceAll(urlParamKeysWithColonPattern, urlParamPattern.source);
  return new RegExp('^' + path + '$', 'i');
};

/**
 * Extract params from a path.
 * ie:
 * ```js
 * const params = urlIsPath(
 *    '/api/users/1212315412/email/test@test.test'
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
