import { AgGridReact } from 'ag-grid-react';
import { forwardRef, useMemo } from 'react';

import { TableSchema } from '@types';
import { DatePickerRenderer } from './DatePickerRenderer';

import './Styles.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.min.css'; // Optional theme CSS
import 'react-datepicker/dist/react-datepicker.css';
import { ErrorTooltip } from '@ui/ErrorTooltip';

interface TableProps {
  data: Record<string, any>[];
  columnDefs: TableSchema[];
  onCellValueEdit: (index: number, field: string, newValue: any) => void;
}

export const Table = forwardRef<AgGridReact, TableProps>(
  ({ onCellValueEdit, columnDefs, data }: TableProps, gridRef) => {
    const defaultColDef = useMemo(
      () => ({
        sortable: false,
        filter: false,
        suppressFilterSearch: true,
        tooltipComponent: ErrorTooltip,
      }),
      []
    );
    /*
     *   const addRow = () => {
     *     gridRef.current?.api.applyTransaction({ add: [{}] });
     *   };
     */

    return (
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        enterNavigatesVertically
        enterNavigatesVerticallyAfterEdit
        components={{
          DatePickerRenderer,
        }}
        rowData={data}
        tooltipShowDelay={0}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellEditingStopped={(e) => {
          const columnDef = e.column.getUserProvidedColDef();
          if (columnDef && columnDef.headerName) {
            const colId = columnDef.headerName;
            onCellValueEdit(e.rowIndex!, colId, e.newValue);
          }
        }}
        /*
         *   const totalRecords = e.api.getDisplayedRowCount();
         *   const currentIndex = e.rowIndex;
         *   const isLastRow = currentIndex === totalRecords - 1;
         */
        /*
         *   const columns = gridRef?.columnApi?.getColumns(),
         *     colId = e.column.getColId();
         *   const columnIndex = columns?.findIndex((col) => col.getColId() === colId);
         *   const isLastColumn = columnIndex === columns!.length - 2;
         *   console.log(isLastColumn);
         *   console.log(e.data); // prints record
         *   if (isLastRow) {
         *     // add row
         *     e.api.applyTransaction({
         *       add: [{}],
         *     });
         *   }
         *   if (isLastColumn) {
         *     focusFirstCellOfRow(currentIndex! + 1);
         *   }
         */
        // }}
        /*
         * rowSelection="multiple" // Options - allows click selection of rows
         * onCellClicked={cellClickedListener} // Optional - registering for Grid Event
         */
      />
    );
  }
);
{
  /*
   * <Button
   *    onClick={() => {
   *      addRow();
   *      focusFirstCellOfRow(gridRef.current!.api.getDisplayedRowCount() - 1);
   *    }}
   *  >
   *    +
   *  </Button>
   */
}
