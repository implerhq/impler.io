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

export const DEFAULT_KEYS_OBJ = {
  null: '<<null>>',
  undefined: '<<undefined>>',
  'Empty String': '<<>>',
  'Empty Array ([])': '<<[]>>',
  'Boolean true': '<<true>>',
  'Boolean false': '<<false>>',
  'UUID v4': '<<uuid>>',
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum SCREENS {
  VERIFY = 'verify',
  ONBOARD = 'onboard',
  HOME = 'home',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum EMAIL_SUBJECT {
  ERROR_SENDING_BUBBLE_DATA = '🛑 Encountered error while sending data to Bubble in',
  ERROR_EXECUTING_VALIDATION_CODE = '🛑 Encountered error while executing validation code in',
  ERROR_SENDING_WEBHOOK_DATA = '🛑 Encountered error while sending webhook data in',
  VERIFICATION_CODE = 'Your Verification Code for Impler',
  RESET_PASSWORD = 'Reset Password | Impler',
  PROJECT_INVITATION = 'New Project Invitation',
}
