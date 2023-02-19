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
 * @param urlOrPath
 * @param pattern
 * @param strict [false]
 * @returns
 */
export const matchPath = (
  urlOrPath: string | URL,
  pattern: string | RegExp,
  strict: boolean = false
): boolean => {
  let path: string = urlOrPath instanceof URL ? urlOrPath.pathname : urlOrPath;
  let rxSrc: string = pattern instanceof RegExp ? pattern.source : pattern;
  if (!strict) {
    if (!(pattern instanceof RegExp)) {
      path = normalizePath(path);
      rxSrc = normalizePath(rxSrc);
    } else {
      pattern = new RegExp(pattern, 'i');
    }
  }
  if (pattern instanceof RegExp) return pattern.test(path);
  else {
    const pathPattern = pathToRegExp(rxSrc);
    return pathPattern.test(path);
  }
};
