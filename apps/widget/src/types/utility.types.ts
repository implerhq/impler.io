export type NotificationContent = { title: string; message: string };

export type TableSchema = {
  field?: string;
  headerName?: string;
  tooltipValueGetter?: (props: any) => string | any;
  tooltipComponentParams?: Record<string, any>;
  valueGetter?: string | ((props: any) => string | any);
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
