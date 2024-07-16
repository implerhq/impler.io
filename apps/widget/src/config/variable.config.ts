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

export const cronExampleBadges = [
  '*/5 * * * *',
  '*/8 * * * *',
  '*/00 * * * *',
  '*/0 * 6 * *',
  '*/8 * * 5 *',
  '*/00 * 4 * *',
  '*/0 * 6 * *',
];

export const cronExamples = [
  { expression: '* * * * *', schedule: 'Every minute' },
  { expression: '0 * * * *', schedule: 'Every hour' },
  { expression: '0 0 * * *', schedule: 'Every day at 12:00 AM' },
  { expression: '0 0 * * FRI', schedule: 'At 12:00 AM, only on Friday' },
  { expression: '0 0 1 * *', schedule: 'At 12:00 AM, on day 1 of the month' },
];

export type ScheduleFormValues = {
  Minute: string;
  Hour: string;
  Day: string;
  Month: string;
  Days: string;
};

export const defaultCronValues: ScheduleFormValues = {
  Minute: '*',
  Hour: '*',
  Day: '*',
  Month: '*',
  Days: '*',
};
