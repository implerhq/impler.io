import { CookieOptions } from 'express';

export const APIMessages = {
  FILE_TYPE_NOT_VALID: 'File type is not supported.',
  FILE_IS_EMPTY: 'File is empty',
  FILE_CONTENT_INVALID: 'File content is invalid. Please check the file or upload new file.',
  FILE_HAS_ISSUE: 'Uploaded file has some issues. Please check the file or upload new file.',
  EMPTY_HEADING_PREFIX: 'Empty Heading',
  INVALID_TEMPLATE_ID_CODE_SUFFIX: 'is not valid TemplateId or CODE.',
  FILE_MAPPING_REMAINING: 'File mapping is not yet done, please finalize mapping before.',
  UPLOAD_NOT_FOUND: 'Upload information not found with specified uploadId.',
  TEMPLATE_NOT_FOUND: 'Template not found with specified templateId.',
  FILE_NOT_FOUND_IN_STORAGE:
    "File not found, make sure you're using the same storage provider, that you were using before.",
  DO_MAPPING_FIRST: 'You may landed to wrong place, Please finalize mapping and proceed ahead.',
  DO_REVIEW_FIRST: 'You may landed to wrong place, Please review data and proceed ahead.',
  DO_CONFIRM_FIRST: 'You may landed to wrong place, Please confirm data and proceed ahead.',
  ALREADY_CONFIRMED: '`You may landed to wrong place, This upload file is confirmed already.',
  IN_PROGRESS: 'You may landed to wrong place, This uploaded file processing is started already.',
  COMPLETED: 'You may landed to wrong place, This uploaded file is already completed, no more steps left to perform.',
  PROJECT_WITH_TEMPLATE_MISSING: 'Template not found with provided ProjectId and Template',
  PROJECT_NOT_ASSIGNED: 'Project is not assigned to you',
  USER_NOT_FOUND: 'User is not found',
  UNIQUE_EMAIL: 'Email address already in use',
  INCORRECT_LOGIN_CREDENTIALS: 'Incorrect email or password provided',
  OPERATION_NOT_ALLOWED: `You're not allowed to perform this action.`,
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INCORRECT_KEYS_FOUND: 'Invalid keys found! Please check and correct them from web',
  INVALID_AUTH_TOKEN: 'Invalid authentication token',
  INVALID_RSS_URL: 'The Specified URL doesn`t contain any RSS XML Feed, Please enter a Valid RSS XML URL',
};

export const CONSTANTS = {
  PASSWORD_SALT: 10,
  EXCEL_DATA_SHEET_STARTER: 'imp_',
  AUTH_COOKIE_NAME: 'authentication',
  // eslint-disable-next-line no-magic-numbers
  maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
  DEFAULT_USER_AVATAR: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  CHUNK_VARIABLES: ['page', 'chunkSize', 'template', 'uploadId', 'fileName', 'extra'],
  CHUNK_FORMAT: `{
  "data": "{{data}}",
  "page": "{{page}}",
  "chunkSize": "{{chunkSize}}",
  "template": "{{template}}",
  "uploadId": "{{uploadId}}",
  "fileName": "{{fileName}}",
  "extra": "{{extra}}"
}`,
  COMBINED_FORMAT: `{
  "%data%": {},
  "page": "{{page}}",
  "chunkSize": "{{chunkSize}}",
  "template": "{{template}}",
  "uploadId": "{{uploadId}}",
  "fileName": "{{fileName}}",
  "extra": "{{extra}}"
}`,
  BUBBLEIO_PROPS: {},
};

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: CONSTANTS.maxAge,
  sameSite: 'none',
};

export const VARIABLES = {
  ONE: 1,
  TWO: 2,
};

export const DATE_FORMATS = {
  COMMON: 'DD MMM YYYY',
};
