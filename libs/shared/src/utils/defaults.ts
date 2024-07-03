import { v4 as uuidv4 } from 'uuid';

export const Defaults = {
  ONE: 1,
  PAGE_LIMIT: 100,
  ZERO: 0,
  MINUS_ONE: -1,
  NOT_FOUND_STATUS_CODE: 404,
  READY_STATE: 1,
  CHUNK_SIZE: 100,
  DATE_FORMATS: ['DD/MM/YYYY'],
  DATE_FORMAT: 'DD/MM/YYYY',
};

export const DEFAULT_VALUES = [
  {
    label: 'null',
    value: '<<null>>',
  },
  {
    label: 'undefined',
    value: '<<undefined>>',
  },
  {
    label: 'Empty String',
    value: '<<>>',
  },
  {
    label: 'Empty Array ([])',
    value: '<<[]>>',
  },
  {
    label: 'Boolean true',
    value: '<<true>>',
  },
  {
    label: 'Boolean false',
    value: '<<false>>',
  },
  {
    label: 'UUID v4',
    value: '<<uuid>>',
  },
];

export const DEFAULT_VALUES_ARR = DEFAULT_VALUES.reduce((acc: string[], item) => {
  acc.push(item.value);

  return acc;
}, [] as string[]);

export const DEFAULT_VALUES_OBJ = {
  '<<null>>': null,
  '<<undefined>>': undefined,
  '<<>>': '',
  '<<[]>>': [],
  '<<true>>': true,
  '<<false>>': false,
  '<<uuid>>': uuidv4,
};
