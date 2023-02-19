export function isPromise<T>(p: any): p is Promise<T> {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
}
