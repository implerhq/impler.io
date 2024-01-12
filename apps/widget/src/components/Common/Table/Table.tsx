/* eslint-disable max-len */
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
  onRecordDelete?: (index: number, isValid: boolean) => void;
  onValueChange?: (row: number, prop: string, oldVal: any, newVal: any) => void;
}

Handsontable.renderers.registerRenderer(
  'custom',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  function renderer(instance, TD, row, col, prop, value, cellProperties) {
    const name = String(prop).replace('record.', '');
    TD.classList.add('custom-cell');
    $(TD).tooltip('dispose');
    const soureData = instance.getSourceDataAtRow(row) as IRecord;
    const fieldValue = typeof soureData.record[name] === 'undefined' ? '' : soureData.record[name];

    if (soureData.errors && soureData.errors[name]) {
      $(TD).tooltip({
        container: 'body',
        trigger: 'hover',
        title: soureData.errors[name],
        placement: 'auto',
      });
    }

    if (soureData.updated && soureData.updated[name]) {
      if (soureData.errors && soureData.errors[name]) {
        TD.innerHTML =
          fieldValue +
          `<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;float: right;cursor: pointer;color:#795e00;" viewBox="-2 -2 24 24" width="20" fill="currentColor">
            <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
          </svg>`;
      } else {
        TD.innerText = fieldValue;
      }
      TD.style.backgroundColor = '#ffda5b';

      return TD;
    }
    if (soureData.errors && soureData.errors[name]) {
      TD.innerHTML =
        fieldValue +
        `<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;float: right;cursor: pointer;color:#ff1111;" viewBox="-2 -2 24 24" width="20" fill="currentColor">
              <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
            </svg>`;
      TD.style.backgroundColor = '#fdebeb';

      return TD;
    }

    TD.innerText = fieldValue;

    return TD;
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
Handsontable.renderers.registerRenderer('del', function renderer(instance, TD, row, col, prop, value, cellProperties) {
  TD.classList.add('del-cell');
  const soureData = instance.getSourceDataAtRow(row) as IRecord;

  TD.dataset.index = String(soureData.index);
  TD.dataset.isValid = String(soureData.isValid);
  TD.innerHTML = `<button class="del-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 24 24" width="22" fill="currentColor"><path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path></svg></button>`;

  return TD;
});

export const Table = forwardRef<HotTable, TableProps>(
  (
    {
      afterRender,
      height = 'auto',
      width = 'auto',
      headings,
      columnDefs,
      data,
      onValueChange,
      onRecordDelete,
    }: TableProps,
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
        afterOnCellMouseDown={function (e, coords, TD) {
          if (TD.classList.contains('del-cell')) {
            const dataIndex = TD.dataset.index;
            const isValid = TD.dataset.isValid === 'true';
            if (onRecordDelete && Number(dataIndex)) onRecordDelete(Number(dataIndex), isValid);
          }
        }}
        beforeChange={(changes) => {
          for (let i = 0; i < changes.length; i++) {
            if (changes[i] && changes[i]?.[3] === null) changes[i]![3] = undefined;
          }
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
