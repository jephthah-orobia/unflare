import { parseQuery } from './query/parse-query';

/**
 * inspect the url and return an object containing the `path` and `query`
 * @param url string of the url
 * @param host string of the host, get this from the header 'host'
 * @returns object that contains `path` and `query`
 */
export const inspectURL = (
  url: string,
  host: string
): {
  path: string;
  query: { [index: string]: string };
} => {
  if (!url.includes(host)) throw new Error('host not found in the url');
  const pathStart: number = url.indexOf(host) + host.length;

  const queryStart: number = url.indexOf('?');

  const path: string =
    queryStart >= 0
      ? url.substring(pathStart, queryStart)
      : url.substring(pathStart);

  const query = parseQuery(url);

  return { path, query };
};
