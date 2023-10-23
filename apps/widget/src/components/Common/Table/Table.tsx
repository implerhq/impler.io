import moment from 'moment';
import DatePicker from 'react-datepicker';
import { AgGridReact } from 'ag-grid-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { Button } from '@ui/Button';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.min.css'; // Optional theme CSS
import 'react-datepicker/dist/react-datepicker.css';
import './Styles.css';

const ButtonRenderer = ({ onClick, node }: any) => {
  return (
    <Button size="xs" color="red" onClick={() => onClick(node.data)}>
      x
    </Button>
  );
};
const DatePickerRenderer = forwardRef<any, any>((props, ref) => {
  const [editing, setEditing] = useState(true);
  const [date, setDate] = useState(props.value ? moment(props.value, 'DD MM YYYY').toDate() : null);

  useEffect(() => {
    if (!editing) {
      props.api.stopEditing();
    }
  }, [editing]);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return moment(date).format('DD/MM/YYYY');
      },
    };
  });

  const onChange = (selectedDate) => {
    setDate(selectedDate);
    setEditing(false);
  };

  return (
    <DatePicker
      portalId="root"
      popperClassName="ag-custom-component-popup"
      selected={date}
      dateFormat="dd/MM/yyyy"
      onChange={onChange}
    />
  );
});
const EmailRenderer = forwardRef<any, any>((props, ref) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value || undefined);

  useEffect(() => {
    refInput.current?.focus();
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    };
  });

  return <input type="email" ref={refInput} value={value} onChange={(event) => setValue(event.target.value)} />;
});

export const Table = () => {
  const gridRef = useRef<AgGridReact>(null);
  const deleteRow = useCallback((index: number) => {
    gridRef.current?.api.applyTransaction({
      remove: [index],
    });
  }, []);
  const [columnDefs] = useState([
    {
      headerName: '#',
      valueGetter: 'node.rowIndex + 1',
    },
    {
      field: 'make',
      // filter: true
      editable: true,
      // sortable: true,
      cellRenderer: (cellProps: any) => cellProps.value,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
      },
      // wrapText: true,
    },
    {
      field: 'date',
      editable: true,
      cellEditor: DatePickerRenderer,
    },
    { field: 'email', editable: true, cellEditor: EmailRenderer },
    { field: 'available', cellEditor: 'agCheckboxCellEditor', editable: true },
    { field: 'price', editable: true },
    {
      headerName: 'Delete',
      cellRenderer: ButtonRenderer,
      cellRendererParams: {
        onClick: deleteRow,
      },
    },
  ]);
  const defaultColDef = useMemo(
    () => ({
      sortable: false,
      filter: false,
      suppressFilterSearch: true,
    }),
    []
  );
  const focusFirstCellOfRow = (index: number) => {
    gridRef.current?.api.stopEditing();
    gridRef.current?.api.setFocusedCell(index, columnDefs[1].field!);
    gridRef.current?.api.startEditingCell({
      rowIndex: index,
      colKey: columnDefs[1].field!,
    });
  };
  const addRow = () => {
    gridRef.current?.api.applyTransaction({ add: [{}] });
  };

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
        rowData={[
          {
            make: 'Toyota',
            model: 'Celica',
            date: '10 10 2023',
            available: true,
            price: 35000,
          },
          {
            make: 'Toyota',
            model: 'Celica',
            available: false,
            price: 35000,
          },
        ]}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef}
        onCellValueChanged={(e) => {
          const totalRecords = e.api.getDisplayedRowCount();
          const currentIndex = e.rowIndex;
          const isLastRow = currentIndex === totalRecords - 1;

          const columns = gridRef.current?.columnApi?.getColumns(),
            colId = e.column.getColId();
          const columnIndex = columns?.findIndex((col) => col.getColId() === colId);
          const isLastColumn = columnIndex === columns!.length - 2;
          console.log(isLastColumn);
          console.log(e.data); // prints record
          if (isLastRow) {
            // add row
            e.api.applyTransaction({
              add: [{}],
            });
          }
          if (isLastColumn) {
            focusFirstCellOfRow(currentIndex! + 1);
          }
        }}
        /*
         * rowSelection="multiple" // Options - allows click selection of rows
         * onCellClicked={cellClickedListener} // Optional - registering for Grid Event
         */
      />
      <Button
        onClick={() => {
          addRow();
          focusFirstCellOfRow(gridRef.current!.api.getDisplayedRowCount() - 1);
        }}
      >
        +
      </Button>
    </>
  );
};
