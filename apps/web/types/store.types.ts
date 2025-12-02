export interface IAppStore {
  profileInfo?: IProfileData;
  setProfileInfo: (info: IProfileData) => void;
}

export interface IPlanMeta {
  IMAGE_IMPORT: boolean;
  IMPORTED_ROWS: Array<{
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
  UNIQUE_VALUES?: boolean;
  DEFAULT_VALUES?: boolean;
  DATE_FORMATS?: boolean;
  BUBBLE_INTEGRATION?: boolean;
  ALTERNATE_COLUMN_KEYS?: boolean;
  DATA_SEEDING?: boolean;
  MULTI_SELECT_VALUES?: boolean;
  CUSTOM_CODE_VALIDATOR?: boolean;
  LENGTH_VALIDATION?: boolean;
  RANGE_VALIDATION?: boolean;
  DIGITS_VALIDATION?: boolean;
  MULTIPLE_COLUMNS_COMBINATION_UNIQUE_VALIDATION?: boolean;
  WEBHOOK_RETRY_SETTINGS?: boolean;
}

export interface IPlanMetaContext {
  meta: IPlanMeta | null;
  setPlanMeta: (planMeta: IPlanMeta) => void;
}
