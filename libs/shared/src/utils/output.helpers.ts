const tabWidth = 2;
export function createRecordFormat(variables: string[]): string {
  const recordFormat = variables.reduce((acc, variable) => {
    return { ...acc, [variable]: createVariable(variable) };
  }, {});

  return JSON.stringify(recordFormat, null, tabWidth);
}

export function createVariable(name: string) {
  return `{{${name}}}`;
}

export function replaceVariableInStringWithKey(str: string, key: string, value: string) {
  if (typeof value === 'string') return str.replace(createVariable(key), value);

  return value;
}

export function replaceVariableInString(str: string, record: Record<string, string>) {
  const regex = /{{.*?}}/g;
  let found: RegExpExecArray;
  let modifiedStr = str;
  while ((found = regex.exec(str)) !== null) {
    if (found.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // eslint-disable-next-line no-magic-numbers
    const key = found[0].replace(/{{|}}/g, '');
    modifiedStr = replaceVariableInStringWithKey(modifiedStr, key, record[key]);
  }

  return modifiedStr;
}

export function replaceVariable(formatKey: unknown, key: string, value: any, record: Record<string, string>) {
  if (typeof formatKey == 'string' && /{{|}}/g.test(formatKey)) return replaceVariableInString(formatKey, record);
  else if (typeof formatKey === 'object' && !Array.isArray(formatKey) && formatKey !== null) {
    // handling objects
    return replaceVariablesInObject(formatKey as Record<string, unknown>, record);
  } else if (Array.isArray(formatKey)) {
    // handling arrays
    return formatKey.map((item: unknown) => replaceVariable(item, key, value, record));
  }
}

export function replaceVariablesInObject(
  format: Record<string, unknown>,
  record: Record<string, string>
): Record<string, string> {
  return Object.keys(format).reduce((acc, key) => {
    acc[key] = replaceVariable(format[key], key, format[key], record);

    return acc;
  }, {});
}

export function validateVariable(name: string) {
  return /{{|}}/g.test(name);
}
