import { forwardRef } from 'react';
import { HotTable } from '@handsontable/react';
import {
  TextCellType,
  DateCellType,
  NumericCellType,
  registerCellType,
  CheckboxCellType,
  DropdownCellType,
} from 'handsontable/cellTypes';
import {
  registerEditor,
  BaseEditor,
  SelectEditor,
  NumericEditor,
  TextEditor,
  CheckboxEditor,
} from 'handsontable/editors';
import Handsontable from 'handsontable';
import { HotItemSchema } from '@types';
import { registerValidator, dateValidator } from 'handsontable/validators';

registerCellType(NumericCellType);
registerCellType(CheckboxCellType);
registerCellType(DateCellType);
registerCellType(TextCellType);
registerCellType(DropdownCellType);

registerEditor(SelectEditor);
registerEditor(NumericEditor);
registerEditor(TextEditor);
registerEditor(CheckboxEditor);
registerEditor(BaseEditor);

registerValidator(dateValidator);

import 'handsontable/dist/handsontable.full.min.css';

interface TableProps {
  headings: string[];
  height?: string | number;
  width?: string | number;
  afterRender?: () => void;
  data: Record<string, any>[];
  columnDefs: HotItemSchema[];
  onCellValueEdit?: (index: number, field: string, newValue: any) => void;
}

function checkEmpty(value: any) {
  return value === null || value === undefined || value === '';
}

Handsontable.validators.registerValidator('text', function validator(value, callback) {
  if (!this.allowEmpty && checkEmpty(value)) {
    return callback(false);
  }
  if (typeof value !== 'string') {
    return callback(false);
  }
  if (!this.allowDuplicate) {
    const lastSelected = this.instance.getSelectedLast();
    if (lastSelected) {
      const colDataArr = this.instance.getDataAtCol(lastSelected[1]);
      if (colDataArr.includes(value)) {
        return callback(false);
      }
    }
  }
  callback(true);
});
Handsontable.validators.registerValidator('regex', function validator(value, callback) {
  if (!this.allowEmpty && checkEmpty(value)) {
    return callback(false);
  }
  if (!this.allowEmpty && this.regex && !new RegExp(this.regex).test(value)) {
    return callback(false);
  }
  if (!this.allowDuplicate) {
    const lastSelected = this.instance.getSelectedLast();
    if (lastSelected) {
      const colDataArr = this.instance.getDataAtCol(lastSelected[1]);
      console.log(colDataArr, value);
      if (colDataArr.includes(value)) {
        return callback(false);
      }
    }
  }
  callback(true);
});
Handsontable.validators.registerValidator('select', function validator(value, callback) {
  if (!this.allowEmpty && checkEmpty(value)) {
    return callback(false);
  }
  if (!this.allowEmpty && Array.isArray(this.selectOptions) && !this.selectOptions.includes(value)) {
    return callback(false);
  }
  callback(true);
});

export const Table = forwardRef<HotTable, TableProps>(
  ({ afterRender, height = 'auto', width = 'auto', headings, columnDefs, data }: TableProps, gridRef) => {
    return (
      <HotTable
        ref={gridRef}
        data={data}
        width={width}
        height={height}
        rowHeaders={true}
        colHeaders={headings}
        afterRender={afterRender}
        columns={columnDefs}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />
    );
  }
);
