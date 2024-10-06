import Core from 'handsontable/core';
import { CellProperties } from 'handsontable/settings';

export type NotificationContent = { title: string; message: string };

export type HotItemSchema = {
  data: string;
  delimiter?: string;
  className?: string;
  readOnly?: boolean;
  editor?: 'base' | 'select' | boolean | any;
  dateFormat?: string;
  correctFormat?: boolean;
  selectOptions?: string[];
  type?: 'text' | 'numeric' | 'date' | 'dropdown' | 'autocomplete';
  allowDuplicate?: boolean;
  allowEmpty?: boolean;
  allowInvalid?: boolean;
  disableVisualSelection?: boolean;
  description?: string;
  datePickerConfig?: Record<string, any>; // https://github.com/Pikaday/Pikaday#configuration
  renderer?:
    | 'custom'
    | 'check'
    | ((
        instance: Core,
        TD: HTMLTableCellElement,
        row: number,
        col: number,
        prop: string | number,
        value: any,
        cellProperties: CellProperties
      ) => any);
};

export interface IRecordExtended {
  _id?: string;
  checked?: boolean;
  index: number;
  isValid: boolean;
  record: Record<string, any>;
  errors?: Record<string, string>;
  updated: Record<string, boolean>;
}
