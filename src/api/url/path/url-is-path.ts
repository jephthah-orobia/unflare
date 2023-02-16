import { pathToRegExp } from '../params/param-patterns';

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
 * Check if the `urlPath` matches the `path`.
 * - `path` here may contain params identifier such as :id.
 * ie:
 * ```js
 * const isMatch = urlIsPath(
 *    '/api/users/1212315412/email/test@test.test'
 *    '/api/users/:id/email/:email');
 *
 * console.log(isMatch) // logs `true`
 * ```
 * @param urlPath
 * @param path
 * @returns
 */
export const urlIsPath = (urlPath: string, path: string): boolean => {
  urlPath = normalizePath(urlPath);
  path = normalizePath(path);

  const pathPattern = pathToRegExp(path);

  return pathPattern.test(urlPath);
};
