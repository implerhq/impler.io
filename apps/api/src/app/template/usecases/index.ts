import { GetUploads } from './get-uploads/get-uploads.usecase';
import { GetTemplateColumns } from './get-columns/get-columns.usecase';
import { CreateTemplate } from './create-template/create-template.usecase';
import { UpdateTemplate } from './update-template/update-template.usecase';
import { DeleteTemplate } from './delete-template/delete-template.usecase';
import { DownloadSample } from './download-sample/download-sample.usecase';
import { GetValidations } from './get-validations/get-validations.usecase';
import { GetCustomization } from './get-customization/get-customization.usecase';
import { SyncCustomization } from './sync-customization/sync-customization.usecase';
import { UpdateValidations } from './update-validations/update-validations.usecase';
import { DuplicateTemplate } from './duplicate-template/duplicate-template.usecase';
import { GetTemplateDetails } from './get-template-details/get-template-details.usecase';
import { UpdateCustomization } from './update-customization/update-customization.usecase';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';
import { UpdateTemplateColumns } from './update-template-columns/update-template-columns.usecase';

import { GetUploadsCommand } from './get-uploads/get-uploads.command';
import { CreateTemplateCommand } from './create-template/create-template.command';
import { UpdateTemplateCommand } from './update-template/update-template.command';
import { DuplicateTemplateCommand } from './duplicate-template/duplicate-template.command';
import { UpdateValidationsCommand } from './update-validations/update-validations.command';
import { UpdateCustomizationCommand } from './update-customization/update-customization.command';

export const USE_CASES = [
  CreateTemplate,
  UpdateTemplate,
  DeleteTemplate,
  DuplicateTemplate,
  GetTemplateDetails,
  GetUploads,
  SyncCustomization,
  GetTemplateColumns,
  UpdateTemplateColumns,
  UpdateCustomization,
  GetCustomization,
  GetValidations,
  UpdateValidations,
  SaveSampleFile,
  DownloadSample,
  //
];

export {
  CreateTemplate,
  UpdateTemplate,
  DeleteTemplate,
  SyncCustomization,
  GetTemplateDetails,
  GetUploads,
  DuplicateTemplate,
  GetTemplateColumns,
  UpdateTemplateColumns,
  UpdateCustomization,
  GetCustomization,
  GetValidations,
  DownloadSample,
  UpdateValidations,
};
export {
  CreateTemplateCommand,
  UpdateValidationsCommand,
  UpdateTemplateCommand,
  GetUploadsCommand,
  DuplicateTemplateCommand,
  UpdateCustomizationCommand,
};
