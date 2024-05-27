import { ColumnTypesEnum } from '@impler/shared';

export interface IExcelFileHeading {
  key: string;
  isRequired?: boolean;
  type: ColumnTypesEnum;
  selectValues?: string[];
  dateFormats?: string[];
  allowMultiSelect?: boolean;
}
