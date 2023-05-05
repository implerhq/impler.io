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

export function replaceVariableInString(str: string, key: string, value: string) {
  return str.replace(createVariable(key), value);
}

export function replaceVariable(str: unknown, key: string, value: any, record: Record<string, unknown>) {
  if (typeof str === 'number') return str;
  else if (typeof str == 'string' && /{{|}}/g.test(str)) return replaceVariableInString(str, key, value);
  else if (typeof str === 'object' && !Array.isArray(str) && str !== null) {
    // handling objects
    return replaceVariablesInObject(str as Record<string, unknown>, record);
  } else if (Array.isArray(str)) {
    // handling arrays
    return str.map((item: unknown) => replaceVariable(item, key, value, record));
  }
}

export function replaceVariablesInObject(
  format: Record<string, unknown>,
  record: Record<string, unknown>
): Record<string, string> {
  return Object.keys(format).reduce((acc, key) => {
    acc[key] = replaceVariable(format[key], key, format[key], record);

    return acc;
  }, {});
}

export function validateVariable(name: string) {
  return /{{|}}/g.test(name);
}
