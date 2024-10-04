export const TEXTS = {
  PROJECTID_NOT_SPECIFIED:
    'It looks like you have not specified projectId to the import button which is required!',
  IMPLER_UNDEFINED_ERROR:
    'It looks like you have not added embed script or your embed script path is incorrect!',
  IMPLER_NOT_INITIATED: 'It looks like Impler is not initiated!',
};

export const WIDGET_TEXTS = {
  COMMON: {
    FINISH: 'Finish',
    SORRY: 'Sorry!',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    CLOSE_WIDGET: 'Close',
    UPLOAD_AGAIN: 'Upload Again',
  },
  STEPPER_TITLES: {
    GENERATE_TEMPLATE: 'Generate Template',
    UPLOAD_FILE: 'Upload',
    MAP_COLUMNS: 'Map Columns',
    REVIEW_DATA: 'Review',
    SELECT_HEADER: 'Select Header',
    COMPLETE_IMPORT: 'Complete',
    CONFIGURE_JOB: 'Configure',
    SCHEDULE_JOB: 'Schedule',
    CONFIRM_JOB: 'Confirm',
  },
  FILE_DROP_AREA: {
    DROP_FILE: 'Drop and drop a file here',
    CHOOSE_FILE: 'Choose a file',
    IMAGE_FILE_SIZE:
      'Image size should be less than 5 MB. Supported formats are PNG, JPG and JPEG.',
    FILE_FORMATS: 'You can upload: csv, xlsx, xlsm',
    FILE_SELECTED: 'File selected successfully',
  },
  'PHASE0-1': {
    IMPORT_FILE: 'Import File',
    GENERATE_TEMPLATE: 'Generate Template',
    IMAGE_INFO_TITLE: 'Generate template with images',
    IMAGE_INFO_SUBTITLE:
      'Drag and drop images below for image columns and generate a template file containing names of uploaded images.',
  },
  PHASE1: {
    SELECT_TEMPLATE_NAME: 'Template',
    SELECT_TEMPLATE_NAME_PLACEHOLDER: 'Select Template',
    SELECT_TEMPLATE_REQUIRED_MSG: 'Please select a template from the list',

    SELECT_SHEET_NAME: 'Select sheet to Import',
    SELECT_SHEET_NAME_PLACEHOLDER: 'Select Excel sheet',
    SELECT_SHEET_CONFIRM: 'Select',
    SELECT_SHEET_REQUIRED_MSG: 'Please select sheet from the list',

    DOWNLOAD_SAMPLE: 'Download sample',
    GENERATE_TEMPLATE: 'Generate Template',
    SEE_MAPPING: 'See Mapping',

    SELECT_FILE_FORMAT_MSG:
      'File type not supported! Please select a .csv or .xlsx file.',

    TEMPLATE_NOT_FOUND_MSG:
      "We couldn't find the template you're importing! Please check the passed parameters.",
    INCOMPLETE_TEMPLATE_MSG:
      'This import does not have any columns. Please try again after some time!',
  },
  SELECT_HEADER: {
    FILE_DONT_HAVE_HEADERS: 'File does not have headers',
    CONFIRM_AND_CONTINUE: 'Confirm selection and Continue',
    INFO: 'Select Header Row from the table. Rows above the header will not be imported. Click on row to change selection.',
  },
  'PHASE1-2': {
    ENTER_DATA: 'Manually enter your data',
    RECOMMANDED_LIMIT: 'Recommanded upto {records} records',
    FIX_INVALID_DATA: 'To complete import you need to fix invalid data',
  },
  PHASE2: {
    REVIEW_DATA: 'Review Data',
    IN_SCHEMA_TITLE: 'Column in schema',
    IN_SHEET_TITLE: 'Column in your sheet',
    MAPPING_NOT_DONE_TEXT: 'Not Mapped',
    MAPPING_DONE_TEXT: 'Mapping Successful',
    MAPPING_FIELD_PLACEHOLDER: 'Select Field',
    FIELD_REQUIRED_MSG: 'This field is required',
    ALREADY_MAPPED_MSG: '{field} is already mapped to {column}',
  },
  PHASE3: {
    COMPLETE: 'Complete',
    EXPORT_DATA: 'Export Data',
    RE_REVIEW_DATA: 'Re-Review Data',
    ALL_RECORDS_VALID_TITLE: ' All records are found valid!',
    ALL_RECORDS_VALID_DETAILS:
      'All {total} row(s) found valid! Would you like to complete the Import?',
    LABEL_ALL_RECORDS: `All {records}`,
    LABEL_VALID_RECORDS: `Valid {records}`,
    LABEL_INVALID_RECORDS: `Invalid {records}`,

    REPLACE: 'Replace',
    FIND_REPLACE: 'Find and Replace',
    ALL_COLUMNS_LABEL: 'All Columns',

    FIND_LABEL: 'Find',
    FIND_PLACEHOLDER: 'Empty Cell',

    REPLACE_LABEL: 'Replace',
    IN_COLUMN_LABEL: 'In Column',
    CASE_SENSITIVE_LABEL: 'Case Sensitive',
    MATCH_ENTIRE_LABEL: 'Match Entire Cell',
  },
  PHASE4: {
    TITLE: 'Bravo! {count} rows have been uploaded',
    SUB_TITLE:
      '{count} rows have been uploaded successfully and currently is in process, it will be ready shortly.',
    UPLOAD_AGAIN: 'Upload New File',
  },
  AUTOIMPORT_PHASE1: {
    MAPCOLUMN: 'Map Column',
  },
  AUTOIMPORT_PHASE2: {
    SCHEDULE: 'Schedule',
    IN_SCHEMA_TITLE: 'Column in schema',
    IN_FEED_TITLE: 'Key in your RSS feed ',
  },
  AUTOIMPORT_PHASE3: {
    CONFIRM: 'Confirm',
    INVALID_CRON_MESSAGE:
      'Expression values are incorrect. Please update values as per valid values below!',
  },
  DELETE_RECORDS_CONFIRMATION: {
    TITLE: `{total} rows will be deleted. Are you sure?`,
    DETAILS: 'This action cannot be undone.',
    CONFIRM_DELETE: 'Yes',
    CANCEL_DELETE: 'Cancel',
  },
  CLOSE_CONFIRMATION: {
    TITLE: `Are you sure? You will lose your work in progress.`,
    DETAILS: 'Your import is in progress, clicking <b>Yes</b> will reset it.',
    CONFIRM_CLOSE: 'Yes',
    CANCEL_CLOSE: 'No',
  },
};
