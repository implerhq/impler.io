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
  REMOVE_BRANDING: boolean;
  AUTOMATIC_IMPORTS: boolean;
  ADVANCED_VALIDATORS: boolean;
  TEAM_MEMBERS: number;
}

export interface IPlanMetaContext {
  meta: IPlanMeta | null;
  setPlanMeta: (planMeta: IPlanMeta) => void;
}
