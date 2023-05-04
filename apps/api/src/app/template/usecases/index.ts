import { GetUploads } from './get-uploads/get-uploads.usecase';
import { GetTemplateColumns } from './get-columns/get-columns.usecase';
import { CreateTemplate } from './create-template/create-template.usecase';
import { UpdateTemplate } from './update-template/update-template.usecase';
import { DeleteTemplate } from './delete-template/delete-template.usecase';
import { GetTemplateDetails } from './get-template-details/get-template-details.usecase';
import { UpdateTemplateColumns } from './update-template-columns/update-template-columns.usecase';
import { UpdateCustomization } from './update-customization/update-customization.usecase';
import { GetCustomization } from './get-customization/get-customization.usecase';

import { GetUploadsCommand } from './get-uploads/get-uploads.command';
import { CreateTemplateCommand } from './create-template/create-template.command';
import { UpdateTemplateCommand } from './update-template/update-template.command';
import { UpdateCustomizationCommand } from './update-customization/update-customization.command';

export const USE_CASES = [
  CreateTemplate,
  UpdateTemplate,
  DeleteTemplate,
  GetTemplateDetails,
  GetUploads,
  GetTemplateColumns,
  UpdateTemplateColumns,
  UpdateCustomization,
  GetCustomization,
  //
];

export {
  CreateTemplate,
  UpdateTemplate,
  DeleteTemplate,
  GetTemplateDetails,
  GetUploads,
  GetTemplateColumns,
  UpdateTemplateColumns,
  UpdateCustomization,
  GetCustomization,
};
export { CreateTemplateCommand, UpdateTemplateCommand, GetUploadsCommand, UpdateCustomizationCommand };
