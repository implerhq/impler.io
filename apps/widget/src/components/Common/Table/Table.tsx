/* eslint-disable max-len */
import { forwardRef } from 'react';
import { HotTable } from '@handsontable/react';
import 'cooltipz-css/cooltipz.min.css';
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
import { HANDSONTABLE_LICENSE_KEY } from '@config';
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
import './HandsonTable.styles.min.css';

interface TableProps {
  headings: string[];
  allChecked?: boolean;
  frozenColumns?: number;
  height?: string | number;
  width?: string | number;
  afterRender?: () => void;
  data: Record<string, any>[];
  columnDefs: HotItemSchema[];
  onCheckAll?: (checked: boolean) => void;
  onValueChange?: (row: number, prop: string, oldVal: any, newVal: any) => void;
  onRowCheck?: (rowIndex: number, recordIndex: number, checked: boolean) => void;
}

Handsontable.renderers.registerRenderer(
  'custom',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  function renderer(instance, TD, row, col, prop, value, cellProperties) {
    const name = String(prop).replace('record.', '');
    TD.classList.add('custom-cell');
    TD.ariaLabel = '';
    const soureData = instance.getSourceDataAtRow(row) as IRecord;
    let fieldValue = typeof soureData.record[name] === 'undefined' ? '' : soureData.record[name];
    if (typeof fieldValue === 'string' && fieldValue.length > name.length + 20)
      fieldValue = value.substring(0, name.length + 20) + '...';

    if (soureData.errors && soureData.errors[name]) {
      TD.ariaLabel = soureData.errors[name];
      TD.dataset.cooltipzDir = row < 5 ? 'bottom' : 'top';
      TD.dataset.cooltipzSize = 'fit';
    }

    const errorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    errorSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    errorSvg.setAttribute('viewBox', '-2 -2 24 24');
    errorSvg.setAttribute('width', '20');
    errorSvg.setAttribute('fill', 'currentColor');
    const errorSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    errorSvgPath.setAttribute(
      'd',
      'M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'
    );
    errorSvg.appendChild(errorSvgPath);

    TD.innerHTML = '';
    TD.appendChild(document.createTextNode(fieldValue));
    if (soureData.updated && soureData.updated[name]) {
      errorSvg.setAttribute('style', 'vertical-align: middle;float: right;cursor: pointer;color:#795e00;');
      if (soureData.errors && soureData.errors[name]) {
        TD.appendChild(errorSvg);
      }
      TD.style.backgroundColor = '#ffda5b';

      return TD;
    }
    if (soureData.errors && soureData.errors[name]) {
      errorSvg.setAttribute('style', 'vertical-align: middle;float: right;cursor: pointer;color:#ff1111;');
      TD.appendChild(errorSvg);
      TD.style.backgroundColor = '#fdebeb';

      return TD;
    }

    return TD;
  }
);

Handsontable.renderers.registerRenderer(
  'check',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  function renderer(instance, TD, row, col, prop, value, cellProperties) {
    TD.classList.add('check-cell');
    const soureData = instance.getSourceDataAtRow(row) as IRecord & { checked?: boolean };

    TD.dataset.checked = String(!!soureData.checked);
    TD.dataset.rowIndex = String(row);
    TD.dataset.recordIndex = String(soureData.index);

    const checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('checkbox');
    const checkbox = document.createElement('input');
    checkbox.checked = !!soureData.checked;
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox__control');
    checkboxDiv.appendChild(checkbox);

    const checkboxControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    checkboxControlIcon.classList.add('checkbox__control-icon');
    checkboxControlIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    checkboxControlIcon.setAttribute('viewBox', '-2 -2 24 24');
    const checkboxControlIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkboxControlIconPath.setAttribute(
      'd',
      'M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z'
    );
    checkboxControlIconPath.setAttribute('fill', 'currentColor');
    checkboxControlIcon.appendChild(checkboxControlIconPath);
    checkboxDiv.appendChild(checkboxControlIcon);

    TD.innerHTML = '';
    TD.appendChild(checkboxDiv);

    return TD;
  }
);

export const Table = forwardRef<HotTable, TableProps>(
  (
    {
      afterRender,
      height = 'auto',
      width = 'auto',
      headings,
      columnDefs,
      data,
      allChecked,
      onRowCheck,
      onCheckAll,
      frozenColumns = 2,
      onValueChange,
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
          if (TD.classList.contains('check-cell') && onRowCheck) {
            const checked = TD.dataset.checked === 'true';
            onRowCheck(Number(TD.dataset.rowIndex), Number(TD.dataset.recordIndex), !checked);
          } else if (TD.classList.contains('check-all-cell') && onRowCheck) {
            onCheckAll?.(!allChecked);
          }
        }}
        beforeChange={(changes) => {
          for (let i = 0; i < changes.length; i++) {
            // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
            if (changes[i] && changes[i]?.[3] === null) changes[i]![3] = undefined;
          }
        }}
        afterGetColHeader={function (i, TH) {
          if (i === 0) {
            TH.classList.add('check-all-cell');
            TH.innerHTML = `<div class="checkbox"><input type="checkbox" ${
              allChecked ? 'checked' : ''
            } class="checkbox__control"><svg class="checkbox__control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24"><path fill="currentColor" d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path></svg></div>`;
          }
        }}
        stretchH="all"
        columns={columnDefs}
        colHeaders={headings}
        afterRender={afterRender}
        manualColumnResize
        fixedColumnsLeft={frozenColumns}
        licenseKey={HANDSONTABLE_LICENSE_KEY}
      />
    );
  }
);
