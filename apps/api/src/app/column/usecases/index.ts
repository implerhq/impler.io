import { AddColumn } from './add-column/add-column.usecase';
import { UpdateColumn } from './update-column/update-column.usecase';
import { DeleteColumn } from './delete-column/delete-column.usecase';
import { UpdateColumns } from './update-columns/update-columns.usecase';

export const USE_CASES = [
  UpdateColumns,
  AddColumn,
  DeleteColumn,
  UpdateColumn,
  //
];

export { UpdateColumns, AddColumn, UpdateColumn, DeleteColumn };
