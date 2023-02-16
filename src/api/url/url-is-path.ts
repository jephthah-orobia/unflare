import { normalizePath, pathToRegExp } from './get-params';

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
