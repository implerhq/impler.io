export const changeToCode = (str = '') =>
  str
    ?.replace(/[^\s\w]/gi, '')
    ?.toUpperCase()
    ?.replace(/ /g, '_');
