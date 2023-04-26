import { UpdateColumns } from './update-columns/update-columns.usecase';
import { GetColumns } from './get-columns/get-columns.usecase';
import { AddColumn } from './add-column/add-column.usecase';
import { UpdateColumn } from './update-column/update-column.usecase';

export const USE_CASES = [
  UpdateColumns,
  GetColumns,
  AddColumn,
  UpdateColumn,
  //
];

export { UpdateColumns, GetColumns, AddColumn, UpdateColumn };
