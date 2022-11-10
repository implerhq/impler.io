export const APIMessages = {
  FILE_TYPE_NOT_VALID: 'File type is not supported.',
  FILE_IS_EMPTY: 'File is empty',
  EMPTY_HEADING_PREFIX: 'Empty Heading',
  INVALID_TEMPLATE_ID_CODE_SUFFIX: 'is not valid TemplateId or CODE.',
  FILE_MAPPING_REMAINING: 'File mapping is not yet done, please finalize mapping before.',
  UPLOAD_NOT_FOUND: 'Upload information not found with specified uploadId.',
  FILE_NOT_FOUND_IN_STORAGE:
    "File not found, make sure you're using the same storage provider, that you were using before.",
  DO_MAPPING_FIRST: 'You may landed to wrong place, Please finalize mapping and proceed ahead.',
  DO_REVIEW_FIRST: 'You may landed to wrong place, Please review data and proceed ahead.',
  DO_CONFIRM_FIRST: 'You may landed to wrong place, Please confirm data and proceed ahead.',
  ALREADY_CONFIRMED: '`You may landed to wrong place, This upload file is confirmed already.',
  IN_PROGRESS: 'You may landed to wrong place, This uploaded file processing is started already.',
  COMPLETED: 'You may landed to wrong place, This uploaded file is already completed, no more steps left to perform.',
  PROJECT_WITH_TEMPLATE_MISSING: 'Template not found with provided ProjectId and Template',
};

export const Defaults = {
  DATA_LENGTH: 1,
  PAGE: 1,
  PAGE_LIMIT: 100,
};
