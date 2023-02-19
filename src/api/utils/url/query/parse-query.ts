/**
 * Parses `url` into an object with key=value set to properties.
 * Note: If you provide a string, this parser does not validate the string, it will only look for key=value pairs in the string.
 * If no key=value pattern is found, an empty object will be returned
 * @param url a URL Object or a string containing the query. It could be a full url or just the queryPart.
 * @returns An object with key=value set to property
 */
export const parseQuery = (url: URL | string): { [index: string]: any } => {
  const query: { [index: string]: any } = {};
  if (url instanceof URL) {
    const searchParams = url.searchParams;
    for (let [key, value] of searchParams) {
      query[key] = value;
    }
  } else {
    const pairs = url.matchAll(/([a-z\d%_.~+-]*)\=([a-z\d%_.~+-]*)/gi);
    if (!pairs) return {};
    for (let kv of pairs)
      if (kv.length == 3 && kv[1] !== undefined)
        query[decodeURIComponent(kv[1])] = !kv[2]
          ? null
          : decodeURIComponent(kv[2]);
  }
  return query;
};
