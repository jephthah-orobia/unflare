export function isJson(str: string): boolean {
  try {
    const obj = JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
