/**
 * checks wether a string is a JSON string or not.
 * @param string to inspect if it is a JSON string.
 * @returns [boolean] true or false
 */
export function isJson(str: string): boolean {
  try {
    const obj = JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
