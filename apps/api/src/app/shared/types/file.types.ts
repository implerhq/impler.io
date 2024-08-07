import { ColumnTypesEnum } from '@impler/shared';

export interface IExcelFileHeading {
  key: string;
  description?: string;
  isRequired?: boolean;
  isFrozen?: boolean;
  delimiter?: string;
  type: ColumnTypesEnum;
  selectValues?: string[];
  dateFormats?: string[];
  allowMultiSelect?: boolean;
}
