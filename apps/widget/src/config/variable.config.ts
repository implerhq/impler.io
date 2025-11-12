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
  SHOW_IMAGE_ALERT_STORAGE_KEY: 'showImageAlert',
  SHOW_WELCOME_IMPORTER_STORAGE_KEY: 'showWelcomeImporter',
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
  IMAGE_PAYLOAD: 'Image payload',
  IMAGE_SELECTED: 'Image selected',
  HIDE_IMAGE_INFO: 'Hide image info',
  RECORDS_DELETED: 'Records deleted',
  IMPORT_INTENT: 'Import Intent',
};

export const keysToOmit = new Set([
  'rss > channel > atom:id',
  'rss > $ > xmlns:opensearch',
  'rss > $ > xmlns:blogger',
  'rss > $ > xmlns:georss',
  'rss > $ > xmlns:gd',
  'rss > $ > xmlns:thr',
  'rss',
  'rss > $',
  'rss > $ > xmlns:content',
  'rss > $ > xmlns:rdf',
  'rss > $ > xmlns:itunes',
  'rss > $ > xmlns:media',
  'rss > $ > xmlns:dc',
  'rss > $ > xmlns:gml',
  'rss > $ > xmlns:taxo',
  'rss > $ > xmlns:geo',
  'rss > $ > version',
  'rss > $ > xmlns:atom',
  'rss > channel > atom:link > $ > type',
  'rss > channel > atom:link > $ > rel',
  'rss > channel > atom:link > $ > href',
  'rss > $ > xmlns:content',
  'rss > $ > xmlns:atom',
  'rss > $ > version',
  'rss > $ > xmlns:wfw',
  'rss > $ > xmlns:sy',
  'rss > $ > xmlns:slash',
  'feed > $ > xmlns',
  'feed > $ > xmlns:media',
  'rss',
  'rss > $',
  'rss > channel',
  'rss > channel[]',
  'rss > channel[] > item',
  'rss > channel[] > item[]',
  'rss > channel[] > item[] > guid',
  'rss > channel[] > item[] > guid[]',
  'rss > channel[] > item[] > guid[] > _',
  'rss > channel[] > item[] > guid[] > $',
  'rss > channel[] > item[] > guid[] > $ > isPermaLink',
  'rss > channel[] > atom:link',
  'rss > channel[] > atom:link[] > $',
  'rss > channel[] > atom:link[] > $ > rel',
  'rss > channel[] > atom:link[] > $ > type',
  'rss > channel[] > atom:link[] > $ > href',
]);

export const enum AUTOIMPORTSCHEDULERFREQUENCY {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
export const autoImportSchedulerFrequency: AUTOIMPORTSCHEDULERFREQUENCY[] = [
  AUTOIMPORTSCHEDULERFREQUENCY.DAILY,
  AUTOIMPORTSCHEDULERFREQUENCY.WEEKLY,
  AUTOIMPORTSCHEDULERFREQUENCY.MONTHLY,
  AUTOIMPORTSCHEDULERFREQUENCY.YEARLY,
];
export const weekDays = [
  { short: 'S', full: 'Sunday' },
  { short: 'M', full: 'Monday' },
  { short: 'T', full: 'Tuesday' },
  { short: 'W', full: 'Wednesday' },
  { short: 'T', full: 'Thursday' },
  { short: 'F', full: 'Friday' },
  { short: 'S', full: 'Saturday' },
];
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const positionMap: { [key: string]: string } = {
  First: '1',
  Second: '2',
  Third: '3',
  Fourth: '4',
  Last: 'L',
};

export const monthlyDayPositions = ['First', 'Second', 'Third', 'Fourth', 'Last'];
export const yearlyDayPositions = ['First', 'Second', 'Third', 'Fourth', 'Last'];

export const WIDGET_FEATURES_EXCEPTION_MESSAGES = {
  MAX_RECORDS: 'Configuring maxRecords property is not allowed in your current plan',
  TEXT_CUSTOMIZATION: 'Configuring Widget texts property is not allowed in your current plan',
  APPEARANCE_CUSTOMIZATION: 'Configuring Widget appearance property is not allowed in your current plan',
};
