/* eslint-disable max-len */
import { forwardRef } from 'react';
import { HotTable } from '@handsontable/react';
import 'cooltipz-css/cooltipz.min.css';
import 'tippy.js/dist/tippy.css';
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
import HotTableClass from '@handsontable/react/hotTableClass';
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
import { addTippyToElement, memoize } from '@util';

const createErrorSvg = memoize(() => {
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

  return errorSvg;
});

// Memoized style strings
const memoizedStyles = {
  errorUpdated: 'vertical-align: middle;float: right;cursor: pointer;color:#795e00;',
  errorOnly: 'vertical-align: middle;float: right;cursor: pointer;color:#ff1111;',
};

Handsontable.renderers.registerRenderer(
  'custom',
  function renderer(instance: Handsontable, TD: HTMLTableCellElement, row: number, col: number, prop: string | number) {
    const name = String(prop).replace('record.', '');
    const sourceData = instance.getSourceDataAtRow(row) as IRecord;
    const hasError = sourceData.errors?.[name];
    const isUpdated = sourceData.updated?.[name];

    TD.className = 'custom-cell';
    TD.ariaLabel = '';

    let fieldValue = sourceData.record?.[name] ?? null;

    if (typeof fieldValue === 'string' && fieldValue.length > name.length + 20) {
      fieldValue = fieldValue.slice(0, name.length + 20) + '...';
    }

    if (hasError) {
      TD.ariaLabel = hasError;
      TD.dataset.cooltipzDir = row < 5 ? 'bottom' : 'top';
      TD.dataset.cooltipzSize = 'fit';
    }

    const errorSvg = createErrorSvg().cloneNode(true) as SVGElement;

    TD.innerHTML = '';
    const valueSpan = document.createElement('span');
    if (sourceData.updated?.[name] || sourceData.errors?.[name]) {
      valueSpan.classList.add('cell-value');
    }
    if (fieldValue !== null) valueSpan.textContent = fieldValue;
    TD.appendChild(valueSpan);

    if (isUpdated) {
      errorSvg.setAttribute('style', memoizedStyles.errorUpdated);
      if (hasError) {
        TD.appendChild(errorSvg);
      }
      TD.style.backgroundColor = '#ffda5b';
    } else if (hasError) {
      errorSvg.setAttribute('style', memoizedStyles.errorOnly);
      TD.appendChild(errorSvg);
      TD.style.backgroundColor = '#fdebeb';
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

interface TableProps {
  headings: string[];
  allChecked?: boolean;
  rowHeaders?: boolean;
  minSpareRows?: number;
  frozenColumns?: number;
  height?: string | number;
  width?: string | number;
  selectEnabled?: boolean;
  afterRender?: () => void;
  beforePaste?: () => void;
  columnDefs: HotItemSchema[];
  data?: Record<string, any>[];
  columnDescriptions?: string[];
  onCheckAll?: (checked: boolean) => void;
  onValueChange?: (row: number, prop: string, oldVal: any, newVal: any) => void;
  onRowCheck?: (rowIndex: number, recordIndex: number, checked: boolean) => void;
}

export const Table = forwardRef<HotTableClass, TableProps>(
  (
    {
      afterRender,
      height = 'auto',
      width = 'auto',
      headings,
      columnDefs,
      data,
      beforePaste,
      columnDescriptions,
      allChecked,
      onRowCheck,
      onCheckAll,
      rowHeaders,
      minSpareRows,
      frozenColumns = 2,
      onValueChange,
      selectEnabled = true,
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
        beforeKeyDown={(event) => {
          const selected = (gridRef as any)?.current.__hotInstance?.getSelected();
          if (Array.isArray(selected) && selected.length > 0 && Array.isArray(selected[0])) {
            const [[row, col]] = selected;
            const rows = (gridRef as any)?.current?.__hotInstance?.countRows();
            if (event.key === 'Tab' && col === headings.length - 1) {
              (gridRef as any)?.current.__hotInstance.selectCell(Math.min(rows, row + 1), selectEnabled ? 3 : 1);
            }
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
        afterGetColHeader={(i, TH) => {
          TH.innerHTML = '';
          TH.innerHTML = headings[i];

          if (!selectEnabled && i < 0) {
            TH.innerHTML = '#';
          } else if (selectEnabled && i === 0) {
            TH.classList.add('check-all-cell');
            TH.innerHTML = `
              <div class="checkbox">
                <input type="checkbox" ${allChecked ? 'checked' : ''} class="checkbox__control">
                <svg class="checkbox__control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24">
                  <path fill="currentColor" d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path>
                </svg>
              </div>`;
          } else {
            if (columnDescriptions && columnDescriptions[i]) {
              // Create the SVG icon element
              const infoIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              infoIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
              infoIcon.setAttribute('viewBox', '-2 -2 24 24');
              infoIcon.setAttribute('width', '20');
              infoIcon.setAttribute('fill', 'currentColor');
              infoIcon.setAttribute(
                'style',
                'vertical-align: middle;float: right;cursor: pointer;color:#fffff; margin-right:4px;'
              );
              const infoIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              infoIconPath.setAttribute(
                'd',
                'M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'
              );
              infoIcon.appendChild(infoIconPath);
              TH.appendChild(infoIcon);

              addTippyToElement(infoIcon as unknown as HTMLElement, columnDescriptions[i]);
            }
          }
        }}
        stretchH="all"
        renderAllColumns
        manualColumnResize
        columns={columnDefs}
        colHeaders={headings}
        rowHeaders={rowHeaders}
        beforePaste={beforePaste}
        afterRender={afterRender}
        minSpareRows={minSpareRows}
        fixedColumnsLeft={frozenColumns}
        licenseKey={HANDSONTABLE_LICENSE_KEY}
      />
    );
  }
);
