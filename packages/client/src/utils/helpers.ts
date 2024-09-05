export const isObject = (value: any) =>
  typeof value === 'object' &&
  !Array.isArray(value) &&
  value !== null &&
  Object.keys(value).length > 0;
