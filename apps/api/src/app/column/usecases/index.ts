import { AddColumn } from './add-column/add-column.usecase';
import { UpdateColumn } from './update-column/update-column.usecase';
import { DeleteColumn } from './delete-column/delete-column.usecase';
import { SaveSampleFile } from '@shared/usecases';
import { UpdateCustomization } from 'app/template/usecases';
import { UpdateImageColumns } from '@shared/usecases';

export const USE_CASES = [
  AddColumn,
  DeleteColumn,
  UpdateColumn,
  SaveSampleFile,
  UpdateImageColumns,
  UpdateCustomization,
  //
];

export { AddColumn, UpdateColumn, DeleteColumn };
