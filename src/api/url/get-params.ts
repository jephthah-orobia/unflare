export const urlParamKeysPattern = /(?<=\/\:)[a-z][a-z\d\_]*/gi;
export const urlParamKeysWithColonPattern = /(?<=\/)\:[a-z][a-z\d\_]*/gi;
export const urlParamPattern = /(?<=\/)([a-z\-\d\%\_\.\~\+\@]+)/i;

export const getParams = (
  path: string,
  pathPattern: string
): { [index: string]: string } => {
  const params: { [index: string]: string } = {};

  // trim `/`
  if (path[0] === '/') path = path.substring(1);
  if (path.at(-1) === '/') path = path.substring(0, path.length - 1);
  if (pathPattern[0] === '/') pathPattern = pathPattern.substring(1);
  if (pathPattern.at(-1) === '/')
    pathPattern = pathPattern.substring(0, pathPattern.length - 1);

  // extract the name of the params
  const keys = pathPattern.match(urlParamKeysPattern)?.map((v) => v);
  // prepare `pathPattern` for constructing a RexExp object
  pathPattern = pathPattern.replaceAll('/', '\\/');
  pathPattern = pathPattern.replaceAll(
    urlParamKeysWithColonPattern,
    urlParamPattern.source
  );
  // generate RegExp obj
  const pathPatternRX = new RegExp('^' + pathPattern + '$', 'i');

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

  for (let i = 0; i < keys.length; i++) params[keys[i]] = values[i];

  return params;
};
