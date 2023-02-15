import { inspectURL } from './inspect-url';

export const urlIsPath = (url: string, host: string, path: string): boolean => {
  if (path[0] === '/') path = path.substring(1);
  if (path.at(-1) === '/') path = path.substring(0, path.length - 1);
  path = path.replaceAll('/', '\\/');
  path = path.replaceAll(
    /(?<=\/)\:[a-z\d]+/gi,
    '((?<=\\/)[a-z-\\d\\%\\_\\.\\~\\+]+)+'
  );
  const pathPattern = new RegExp('^' + path + '$');
  let pathFromUrl = inspectURL(url, host).path;
  if (pathFromUrl[0] === '/') pathFromUrl = pathFromUrl.substring(1);
  if (pathFromUrl.at(-1) === '/')
    pathFromUrl = pathFromUrl.substring(0, pathFromUrl.length - 1);
  if (!pathPattern.test(pathFromUrl)) console.log(pathFromUrl);
  return pathPattern.test(pathFromUrl);
};
