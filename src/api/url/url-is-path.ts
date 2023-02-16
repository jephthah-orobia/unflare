import { urlParamKeysWithColonPattern, urlParamPattern } from './get-params';
import { inspectURL } from './inspect-url';

export const urlIsPath = (urlPath: string, path: string): boolean => {
  //trim '/'
  if (path[0] === '/') path = path.substring(1);
  if (path.at(-1) === '/') path = path.substring(0, path.length - 1);
  if (urlPath[0] === '/') urlPath = urlPath.substring(1);
  if (urlPath.at(-1) === '/')
    urlPath = urlPath.substring(0, urlPath.length - 1);

  path = path.replaceAll('/', '\\/');
  path = path.replaceAll(urlParamKeysWithColonPattern, urlParamPattern.source);

  const pathPattern = new RegExp('^' + path + '$', 'i');

  return pathPattern.test(urlPath);
};
