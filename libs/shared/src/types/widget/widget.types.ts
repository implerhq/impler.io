import { AppearanceConfig, WIDGET_TEXTS, WidgetConfig } from '@impler/client';
import { ISchemaItem } from '../column';

export interface IImportConfig {
  showBranding: boolean;
  mode: string;
  title: string;
  IMAGE_IMPORT?: boolean;
  IMPORTED_ROWS?: Array<{
    flat_fee: number;
    per_unit: number;
    last_unit: number | string;
    first_unit: number;
  }>;
  REMOVE_BRANDING?: boolean;
  AUTOMATIC_IMPORTS?: boolean;
  ADVANCED_VALIDATORS?: boolean;
  FREEZE_COLUMNS?: boolean;
  TEAM_MEMBERS?: number;
  ROWS?: number;
  MANUAL_ENTRY?: boolean;
  DOWNLOAD_SAMPLE_FILE?: boolean;
  MAX_RECORDS?: boolean;
  REQUIRED_VALUES?: boolean;
  TEXT_CUSTOMIZATION?: boolean;
  DEFAULT_VALUES?: boolean;
  FIND_AND_REPLACE?: boolean;
  RUNTIME_SCHEMA?: boolean;
  DATA_SEEDING?: boolean;
  APPEARANCE_CUSTOMIZATION?: boolean;
  MULTI_SELECT_VALUES?: boolean;
}

export interface IImportConfig {
  showBranding: boolean;
  mode: string;
  title: string;
  IMAGE_IMPORT?: boolean;
  IMPORTED_ROWS?: Array<{
    flat_fee: number;
    per_unit: number;
    last_unit: number | string;
    first_unit: number;
  }>;
  REMOVE_BRANDING?: boolean;
  AUTOMATIC_IMPORTS?: boolean;
  ADVANCED_VALIDATORS?: boolean;
  FREEZE_COLUMNS?: boolean;
  TEAM_MEMBERS?: number;
  ROWS?: number;
  MANUAL_ENTRY?: boolean;
  DOWNLOAD_SAMPLE_FILE?: boolean;
  MAX_RECORDS?: boolean;
  REQUIRED_VALUES?: boolean;
  TEXT_CUSTOMIZATION?: boolean;
  DEFAULT_VALUES?: boolean;
  FIND_AND_REPLACE?: boolean;
  RUNTIME_SCHEMA?: boolean;
  DATA_SEEDING?: boolean;
  APPEARANCE_CUSTOMIZATION?: boolean;
  MULTI_SELECT_VALUES?: boolean;
}

export interface ICommonShowPayload {
  host: string;
  extra?: string | any;
  templateId?: string;
  authHeaderValue?: string;
  primaryColor?: string;
  maxRecords?: number;
  appearance?: AppearanceConfig;
  colorScheme?: string;
  title?: string;
  sampleFile?: File | Blob;
  projectId: string;
  accessToken: string;
  uuid: string;
}
export interface IWidgetShowPayload extends ICommonShowPayload {
  texts?: typeof WIDGET_TEXTS;
  config?: WidgetConfig;
  data?: string;
  schema?: string;
  output?: string;
}

export interface IUserShowPayload extends ICommonShowPayload {
  texts?: string | typeof WIDGET_TEXTS;
  config?: WidgetConfig;
  data?: string | Record<string, string | number>[];
  schema?: string | ISchemaItem[];
  output?: string | Record<string, string | number>;
}

export interface IOption {
  value: string;
  label: string;
}
export enum EventTypesEnum {
  INIT_IFRAME = 'INIT_IFRAME',
  WIDGET_READY = 'WIDGET_READY',
  CLOSE_WIDGET = 'CLOSE_WIDGET',
  AUTHENTICATION_VALID = 'AUTHENTICATION_VALID',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  UPLOAD_STARTED = 'UPLOAD_STARTED',
  UPLOAD_TERMINATED = 'UPLOAD_TERMINATED',
  UPLOAD_COMPLETED = 'UPLOAD_COMPLETED',
  DATA_IMPORTED = 'DATA_IMPORTED',
  IMPORT_JOB_CREATED = 'IMPORT_JOB_CREATED',
}

export enum WidgetEventTypesEnum {
  SHOW_WIDGET = 'SHOW_WIDGET',
  CLOSE_WIDGET = 'CLOSE_WIDGET',
}

export const DEFAULT_WIDGET_TEXTS: typeof WIDGET_TEXTS = {
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
    REVIEW_EDIT: 'Review & Edit',
  },
  FILE_DROP_AREA: {
    DROP_FILE: 'Drag and drop a file Here',
    ONBOARD_DROP_FILE: 'Create Columns from the file',
    CHOOSE_FILE: 'Choose a file',
    IMAGE_FILE_SIZE: 'Image size should be less than 5 MB. Supported formats are PNG, JPG and JPEG.',
    FILE_FORMATS: 'You can upload: csv, xlsx, xlsm',
    ONBOARD_FILE_FORMATS: 'Drop a CSV or Excel file here and columns will be created automatically',
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

    SELECT_FILE_FORMAT_MSG: 'File type not supported! Please select a .csv or .xlsx file.',

    TEMPLATE_NOT_FOUND_MSG: "We couldn't find the template you're importing! Please check the passed parameters.",
    INCOMPLETE_TEMPLATE_MSG: 'This import does not have any columns. Please try again after some time!',
  },
  SELECT_HEADER: {
    FILE_DONT_HAVE_HEADERS: 'File does not have headers',
    CONFIRM_AND_CONTINUE: 'Confirm selection and Continue',
    INFO: 'Select Header Row from the table. Rows above the header will not be imported. Click on the row to change selection.',
  },
  'PHASE1-2': {
    ENTER_DATA: 'Directly enter your data',
    RECOMMENDED_LIMIT: 'Recommended upto {records} records',
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
    ALL_RECORDS_VALID_DETAILS: 'All {total} row(s) found valid! Would you like to complete the Import?',
    LABEL_ALL_RECORDS: `All {records}`,
    LABEL_VALID_RECORDS: `Valid {records}`,
    LABEL_INVALID_RECORDS: `Invalid {records}`,
    MAX_RECORD_LIMIT_ERROR_TITLE: 'Max Record Limit Error',
    REPLACE: 'Replace',
    FIND_REPLACE: 'Find and Replace',
    ALL_COLUMNS_LABEL: 'All Columns',

    FIND_LABEL: 'Find',
    FIND_PLACEHOLDER: 'Empty Cell',

    REPLACE_LABEL: 'Replace',
    IN_COLUMN_LABEL: 'In Column',
    CASE_SENSITIVE_LABEL: 'Case Sensitive',
    MATCH_ENTIRE_LABEL: 'Match Entire Cell',
    MAX_RECORD_LIMIT_ERROR: 'You can not import records more than',
  },
  PHASE4: {
    TITLE: 'Bravo! {count} rows have been uploaded',
    SUB_TITLE: '{count} rows have been uploaded successfully and currently is in process, it will be ready shortly.',
    UPLOAD_AGAIN: 'Upload New File',
  },
  AUTOIMPORT_PHASE1: {
    CLOSE_CONFIRMATION: {
      TITLE: 'Parsing is in progress... Please do not close the Widget !',
    },
    MAPCOLUMN: 'Map Column',
  },
  AUTOIMPORT_PHASE2: {
    SCHEDULE: 'Schedule',
    IN_SCHEMA_TITLE: 'Column in schema',
    IN_FEED_TITLE: 'Key in your RSS feed ',
  },
  AUTOIMPORT_PHASE3: {
    CONFIRM: 'Confirm',
    INVALID_CRON_MESSAGE: 'Expression values are incorrect. Please update values as per valid values below!',
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

export const defaultWidgetAppereance = {
  widget: {
    backgroundColor: '#1c1917',
  },
  fontFamily: 'Inter, sans-serif',
  borderRadius: '12px',
  primaryButtonConfig: {
    backgroundColor: '#f59e0b',
    textColor: '#1c1917',
    hoverBackground: '#fbbf24',
    hoverTextColor: '#1c1917',
    borderColor: 'transparent',
    hoverBorderColor: 'transparent',
    buttonShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
  },
  secondaryButtonConfig: {
    backgroundColor: '#292524',
    textColor: '#fcd34d',
    hoverBackground: '#3c2d2a',
    hoverTextColor: '#fed7aa',
    borderColor: '#44403c',
    hoverBorderColor: '#f59e0b',
    buttonShadow: 'none',
  },
};
