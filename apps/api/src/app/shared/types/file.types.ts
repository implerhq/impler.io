import { ColumnTypesEnum } from '@impler/shared';

export interface IExcelFileHeading {
  key: string;
  isRequired?: boolean;
  isFrozen?: boolean;
  delimiter?: string;
  type: ColumnTypesEnum;
  selectValues?: string[];
  dateFormats?: string[];
  allowMultiSelect?: boolean;
}
