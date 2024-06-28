const milliseconds = 1000,
  hours = 24,
  seconds = 60,
  minutes = 60;

export const variables = {
  error: 'message',
  twentyFourHoursInMs: milliseconds * minutes * seconds * hours,
  colorIndex: 5, // color index of the shades which is primary
  defaultShadesCount: 5, // n * 2 shades will be generated
  baseIndex: 0,
  firstIndex: 1,
  secondIndex: 2,
  thirdIndex: 3,
  hexNumber: 16,
  defaultAlpha: 1,
  shadesMultipler: 2,
  maxColorNumber: 255,
  closeDelayInMS: 100,
  implerWebsite: 'https://impler.io?utm_source=widget',
  LIMIT_5_MB: 5 * 1024 * 1024,
};

export const AMPLITUDE = {
  OPEN: 'open',
  UPLOAD: 'upload',
  MAPPING: 'mapping',
  VALIDATE: 'validate',
  DOWNLOAD_INVALID_DATA: 'download invalid data',
  CONFIRM: 'confirm',
  UPLOAD_AGAIN: 'upload again',
  RESET: 'reset',
  RECORDS: 'records',
  RECORDS_DELETED: 'Records deleted',
};
