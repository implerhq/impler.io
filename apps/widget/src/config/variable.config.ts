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
  { expression: '*', description: 'Any value' },
  { expression: ',', description: 'Value list separator' },
  { expression: '-', description: 'Range of values' },
  { expression: '/', description: 'Step values' },
];

export type ScheduleFormValues = {
  Minute: string;
  Hour: string;
  Day: string;
  Month: string;
  Days: string;
};

export const defaultCronValues: ScheduleFormValues = {
  Minute: '45',
  Hour: '23',
  Day: '*',
  Month: '*',
  Days: '0',
};

export const cronFieldDefinitions = [
  {
    Minute: {
      values: ['*', '/', '-', '0-59'],
      description: ['Any value', 'Step values', 'Range of values', 'Range of allowed values'],
    },
  },
  {
    Hour: {
      values: ['*', '/', '-', '0-23'],
      description: ['Any value', 'Step values', 'Range of values', 'Range of allowed values'],
    },
  },
  {
    Day: {
      values: ['*', '/', '-', '?', '1-31'],
      description: ['Any value', 'Step values', 'Range of values', 'No specific value', 'Range of allowed values'],
    },
  },
  {
    Month: {
      values: ['*', '/', '-', '1-12', 'JAN-DEC'],
      description: [
        'Any value',
        'Step values',
        'Range of values',
        'Range of allowed values',
        'Alternative single values',
      ],
    },
  },
  {
    Days: {
      values: ['*', '/', '-', '?', '0-7', 'SUN-SAT'],
      description: [
        'Any value',
        'Step values',
        'Range of values',
        'No specific value',
        'Range of allowed values (0-7)',
        'Alternative single values',
      ],
    },
  },
];

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
