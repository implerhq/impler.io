import { GetTemplates } from './get-templates/get-templates.usecase';
import { CreateTemplate } from './create-template/create-template.usecase';
import { UpdateTemplate } from './update-template/update-template.usecase';
import { DeleteTemplate } from './delete-template/delete-template.usecase';
import { GetUploads } from './get-uploads/get-uploads.usecase';

export const USE_CASES = [
  GetTemplates,
  CreateTemplate,
  UpdateTemplate,
  DeleteTemplate,
  GetUploads,
  //
];
