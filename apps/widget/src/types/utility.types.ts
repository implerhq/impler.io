import Core from 'handsontable/core';
import { CellProperties } from 'handsontable/settings';

export type NotificationContent = { title: string; message: string };

export type HotItemSchema = {
  data: string;
  className?: string;
  readOnly?: boolean;
  editor?: 'base' | 'select' | boolean;
  validator?: 'numeric' | 'date' | 'base' | 'autocomplete' | 'text' | 'regex' | 'select';
  selectOptions?: string[];
  type?: 'text' | 'numeric' | 'date' | 'dropdown' | 'autocomplete';
  regex?: string;
  allowDuplicate?: boolean;
  allowEmpty?: boolean;
  allowInvalid?: boolean;
  renderer?:
    | 'custom'
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
