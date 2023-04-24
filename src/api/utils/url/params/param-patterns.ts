/**
 *  this pattern can be use to extract the names of identify in a path
 */
export const urlParamKeysPattern = /(?<=\/\:)[a-z][a-z\d\_]*/gi;

/**
 * this pattern can be use to extract the identifiers (including the colon ':')
 */
export const urlParamKeysWithColonPattern = /(?<=\/)\:[a-z][a-z\d\_]*/gi;

export const urlParamOnFirst = /^\:[a-z][a-z\d\_]*/gi;
/**
 * this pattern is used to extract values from path with params identifiers.
 */
export const urlParamPattern = /(?<=\/)([a-z\-\d\%\_\.\~\+\@]+)/i;
export const urlParamPatternFirst = /([a-z\-\d\%\_\.\~\+\@]+)/i;

/**
 * Generates a regular expression pattern base on given path.
 * @param path a path with param identifiers. ie: /api/users/:id/email/:email
 * @returns a new Regular Expression.
 */
export const pathToRegExp = (path: string): RegExp => {
  // prepare `pathPattern` for constructing a RexExp object
  path = path.replaceAll('/', '\\/');
  path = path.replaceAll(urlParamKeysWithColonPattern, urlParamPattern.source);
  path = path.replaceAll(urlParamOnFirst, urlParamPatternFirst.source);
  if (path.at(-1) === '*') {
    path = path.substring(0, path.length - 1);
    if (path.at(-1) === '/') path = path + '*.*';
    else path = path + '.*';
  }
  return new RegExp('^' + path + '$', 'i');
};
