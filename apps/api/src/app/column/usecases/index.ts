import { AddColumn } from './add-column/add-column.usecase';
import { UpdateColumn } from './update-column/update-column.usecase';
import { DeleteColumn } from './delete-column/delete-column.usecase';

export const USE_CASES = [
  AddColumn,
  DeleteColumn,
  UpdateColumn,
  //
];

export { AddColumn, UpdateColumn, DeleteColumn };
