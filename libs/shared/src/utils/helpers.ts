export const changeToCode = (str = '') =>
  str
    ?.replace(/[^\s\w]/gi, '')
    ?.toUpperCase()
    ?.replace(/ /g, '_');

export function isBrowser() {
  return typeof window !== 'undefined';
}

const defaultDigits = 2;
export function numberFormatter(num: number, digits = defaultDigits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (lookupItem) {
      return num >= lookupItem.value;
    });

  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export function replaceVariablesInString(str: string, obj: Record<string, string>): string {
  return str.replace(/{([^{}]*)}/g, function (a, b) {
    const value = obj[b];

    return typeof value === 'string' || typeof value === 'number' ? value : a;
  });
}
