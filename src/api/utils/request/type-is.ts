import { flattenArray } from '../fn/flatten-array';

/**
 * Check if the request's content type is one of the specified.
 * @param req Request provided by
 * @param types a list of regular expressions to test against request.
 * @returns
 */
export function typeIs(req: Request, ...types: (RegExp | RegExp[])[]): boolean {
  const flattenTypes = flattenArray(...types);
  const reqType =
    req.headers.get('Content-Type') || req.headers.get('content-type');

  if (!reqType) return false;

  for (const type of flattenTypes) if (type.test(reqType)) return true;

  return false;
}
