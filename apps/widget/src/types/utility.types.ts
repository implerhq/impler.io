export type NotificationContent = { title: string; message: string };

export type TableSchema = {
  field?: string;
  headerName?: string;
  valueGetter?: string;
  cellRenderer?: (props: any) => string | any;
  cellEditor?:
    | 'agTextCellEditor'
    | 'agLargeTextCellEditor'
    | 'agNumberCellEditor'
    | 'agCheckboxCellEditor'
    | 'agSelectCellEditor'
    | any;
  cellEditorParams?: Record<string, any>;
  cellRendererParams?: Record<string, any>;
  wrapText?: boolean;
  editable?: boolean;
  filter?: boolean;
  sortable?: boolean;
};
