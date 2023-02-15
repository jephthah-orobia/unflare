/**
 * Parse `queryString` into an object with key=value set to properties.
 * Note that this parser does not validate the string, it will only look for key=value pairs in the string.
 * If no key=value pattern is found, an empty object will be returned
 * @param queryString string containing the query. It could be a full url or just the queryPart
 * @returns An object with key=value set to property
 */
export const parseQuery = (queryString: string): { [index: string]: any } => {
  const pairs = queryString.matchAll(/([a-z\d%_.~+-]*)\=([a-z\d%_.~+-]*)/gi);
  if (!pairs) return {};
  const query: { [index: string]: any } = {};
  for (let kv of pairs)
    if (kv.length == 3 && kv[1] !== undefined)
      query[decodeURIComponent(kv[1])] = !kv[2]
        ? null
        : decodeURIComponent(kv[2]);
  return query;
};
