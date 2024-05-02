import Core from 'handsontable/core';
import { CellProperties } from 'handsontable/settings';

export type NotificationContent = { title: string; message: string };

export type HotItemSchema = {
  data: string;
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
  renderer?:
    | 'custom'
    | 'del'
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
