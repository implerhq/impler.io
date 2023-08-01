const tabWidth = 2;
export function createRecordFormat(variables: string[]): string {
  const recordFormat = variables.reduce((acc, variable) => {
    return { ...acc, [variable]: createVariable(variable) };
  }, {});

  return JSON.stringify(recordFormat, null, tabWidth);
}
export function updateCombinedFormat(format: string, variables: string[]): string {
  const combinedFormat = JSON.parse(format);
  const regex = /%.*?%/g;
  const recordFormat = variables.reduce((acc, variable) => {
    return { ...acc, [variable]: createVariable(variable) };
  }, {});
  Object.keys(combinedFormat).forEach((key) => {
    if (regex.test(key) && typeof combinedFormat[key] === 'object' && !Array.isArray(combinedFormat[key])) {
      combinedFormat[key] = recordFormat;
    }
  });

  return JSON.stringify(combinedFormat, null, tabWidth);
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
    if (typeof record[key] !== 'undefined') modifiedStr = replaceVariableInStringWithKey(modifiedStr, key, record[key]);
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

  return formatKey;
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

export function getRecordFormat(chunkFormat: string) {
  const format = JSON.parse(chunkFormat);
  const regex = /%.*?%/g;
  let recordFormat = null;
  Object.keys(format).forEach((key) => {
    if (regex.test(key) && typeof format[key] === 'object') {
      recordFormat = format[key];
      delete format[key];
      format[key.slice(1, -1)] = createVariable('data');
    } else if (regex.test(key) && Array.isArray(format[key])) {
      throw new Error('Array format not supported for record.');
    } else if (Array.isArray(format[key])) {
      format[key] = format[key].map((item) => {
        if (typeof item === 'string' && regex.test(item)) {
          return createVariable(item.slice(1, -1));
        } else if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
          const arrFormat = getRecordFormat(JSON.stringify(item));
          if (arrFormat && arrFormat.chunkFormat) {
            recordFormat = arrFormat.recordFormat;

            return arrFormat.chunkFormat;
          }

          return item;
        } else {
          return item;
        }
      });
    } else if (typeof format[key] === 'object' && !Array.isArray(format[key]) && format[key] !== null) {
      const nestedFormats = getRecordFormat(JSON.stringify(format[key]));
      if (nestedFormats && nestedFormats.recordFormat) {
        format[key] = nestedFormats.chunkFormat;
        recordFormat = nestedFormats.recordFormat;
      }
    }
  });

  if (!recordFormat && recordFormat === null) return null;

  return {
    recordFormat: JSON.stringify(recordFormat),
    chunkFormat: JSON.stringify(format),
  };
}
