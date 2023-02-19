export const flattenArray = (...args: any[]): any[] => {
  const newArray: any[] = [];
  for (const a of args) {
    if (!Array.isArray(a)) newArray.push(a);
    else newArray.push(...flattenArray(...(a as [])));
  }
  return newArray;
};
