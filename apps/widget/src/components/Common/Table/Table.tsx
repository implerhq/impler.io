import { AgGridReact } from 'ag-grid-react';
import { forwardRef, useMemo } from 'react';

// import { Button } from '@ui/Button';
import { TableSchema } from '@types';
import { DatePickerRenderer } from './DatePickerRenderer';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.min.css'; // Optional theme CSS
import 'react-datepicker/dist/react-datepicker.css';
import './Styles.css';
/*
 * import { EmailRenderer } from './EmailRenderer';
 * import { ButtonRenderer } from './ButtonRenderer';
 */

/*
 * const [columnDefs] = useState<TableSchema[]>([
 *   {
 *     headerName: '#',
 *     valueGetter: 'node.rowIndex + 1',
 *   },
 *   {
 *     field: 'make',
 *     // filter: true
 *     editable: true,
 *     // sortable: true,
 *     cellRenderer: (cellProps: any) => cellProps.value,
 *     cellEditor: 'agSelectCellEditor',
 *     cellEditorParams: {
 *       values: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
 *     },
 *     // wrapText: true,
 *   },
 *   {
 *     field: 'date',
 *     editable: true,
 *     cellEditor: DatePickerRenderer,
 *   },
 *   { field: 'email', editable: true, cellEditor: EmailRenderer },
 *   { field: 'available', cellEditor: 'agCheckboxCellEditor', editable: true },
 *   { field: 'price', editable: true },
 *   {
 *     headerName: 'Delete',
 *     cellRenderer: ButtonRenderer,
 *     cellRendererParams: {
 *       onClick: deleteRow,
 *     },
 *   },
 * ]);
 */

/*
 * const deleteRow = useCallback((index: number) => {
 *     gridRef.current?.api.applyTransaction({
 *       remove: [index],
 *     });
 *   }, []);
 */

interface TableProps {
  data: Record<string, any>[];
  columnDefs: TableSchema[];
}

export const Table = forwardRef<AgGridReact, TableProps>(({ columnDefs, data }: TableProps, gridRef) => {
  const defaultColDef = useMemo(
    () => ({
      sortable: false,
      filter: false,
      suppressFilterSearch: true,
    }),
    []
  );
  /*
   *   const focusFirstCellOfRow = (index: number) => {
   *     gridRef.current?.api.stopEditing();
   *     gridRef.current?.api.setFocusedCell(index, columnDefs[1].field!);
   *     gridRef.current?.api.startEditingCell({
   *       rowIndex: index,
   *       colKey: columnDefs[1].field!,
   *     });
   *   };
   *   const addRow = () => {
   *     gridRef.current?.api.applyTransaction({ add: [{}] });
   *   };
   */

  return (
    <>
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        enterNavigatesVertically
        enterNavigatesVerticallyAfterEdit
        components={{
          DatePickerRenderer: DatePickerRenderer,
        }}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={(e) => {
          console.log(e);
          //   e.node.updateData(e.data.);
          /*
           *   e.api.applyTransaction({
           *     update: [e.data],
           *   });
           */
        }}
        // onCellValueChanged={(e) => {
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
      {/* <Button
        onClick={() => {
          addRow();
          focusFirstCellOfRow(gridRef.current!.api.getDisplayedRowCount() - 1);
        }}
      >
        +
      </Button> */}
    </>
  );
});
