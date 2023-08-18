import { AddColumn } from './add-column/add-column.usecase';
import { UpdateColumn } from './update-column/update-column.usecase';
import { DeleteColumn } from './delete-column/delete-column.usecase';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

export const USE_CASES = [
  AddColumn,
  DeleteColumn,
  UpdateColumn,
  SaveSampleFile,
  //
];

export { AddColumn, UpdateColumn, DeleteColumn };
