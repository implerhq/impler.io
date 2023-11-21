import { forwardRef } from 'react';
import { HotTable } from '@handsontable/react';
// eslint-disable-next-line id-length
import $ from 'jquery';

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
import { IRecord } from '@impler/shared';
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

import './HandsonTable.styles.min.css';

interface TableProps {
  headings: string[];
  height?: string | number;
  width?: string | number;
  afterRender?: () => void;
  data: Record<string, any>[];
  columnDefs: HotItemSchema[];
  onValueChange?: (row: number, prop: string, oldVal: any, newVal: any) => void;
}

Handsontable.renderers.registerRenderer(
  'custom',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  function renderer(instance, TD, row, col, prop, value, cellProperties) {
    const name = String(prop).replace('record.', '');
    TD.classList.add('custom-cell');
    const soureData = instance.getSourceDataAtRow(row) as IRecord;

    if (soureData.updated && soureData.updated[name]) {
      if (soureData.errors[name]) {
        TD.innerHTML =
          soureData.record[name] +
          `<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;float: right;cursor: pointer;color:#795e00;" viewBox="-2 -2 24 24" width="20" fill="currentColor">
            <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
          </svg>`;
      } else {
        TD.innerText = soureData.record[name];
        $(TD).tooltip('dispose');
      }
      TD.style.backgroundColor = '#ffda5b';

      return TD;
    }
    if (soureData.errors && soureData.errors[name]) {
      TD.innerHTML =
        soureData.record[name] +
        `<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;float: right;cursor: pointer;color:#ff1111;" viewBox="-2 -2 24 24" width="20" fill="currentColor">
              <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
            </svg>`;

      $(TD).tooltip({
        container: 'body',
        trigger: 'hover',
        title: soureData.errors[name],
        placement: 'auto',
      });
      TD.style.backgroundColor = '#fdebeb';

      return TD;
    }

    $(TD).tooltip('dispose');
    TD.innerText = soureData.record[name];

    return TD;
  }
);

export const Table = forwardRef<HotTable, TableProps>(
  (
    { afterRender, height = 'auto', width = 'auto', headings, columnDefs, data, onValueChange }: TableProps,
    gridRef
  ) => {
    return (
      <HotTable
        ref={gridRef}
        data={data}
        width={width}
        height={height}
        afterChange={(changes) => {
          if (onValueChange && Array.isArray(changes)) {
            changes.forEach((change) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onValueChange(change[0], change[1], change[2], change[3]);
            });
          }
        }}
        fillHandle={{
          autoInsertRow: false,
          direction: 'vertical',
        }}
        stretchH="all"
        columns={columnDefs}
        colHeaders={headings}
        afterRender={afterRender}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />
    );
  }
);
