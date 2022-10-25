export const changeToCode = (str = '') =>
  str
    ?.replace(/[^\s\w]/gi, '')
    ?.toUpperCase()
    ?.replace(/ /g, '_');

export function isBrowser() {
  return typeof window !== 'undefined';
}
