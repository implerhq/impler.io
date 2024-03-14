import { CreateProject } from './create-project/create-project.usecase';
import { CreateProjectCommand } from './create-project/create-project.command';
import { GetImports } from './get-imports/get-imports.usecase';
import { GetProjects } from './get-projects/get-projects.usecase';
import { UpdateProject } from './update-project/update-project.usecase';
import { UpdateProjectCommand } from './update-project/update-project.command';
import { DeleteProject } from './delete-project/delete-project.usecase';
import { GetTemplates } from './get-templates/get-templates.usecase';
import { GetEnvironment } from './get-environment/get-environment.usecase';

import { CreateTemplate, UpdateTemplateColumns } from 'app/template/usecases';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

export const USE_CASES = [
  GetProjects,
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetTemplates,
  GetImports,
  GetEnvironment,
  CreateTemplate,
  SaveSampleFile,
  UpdateTemplateColumns,
  //
];

export { CreateProject, GetProjects, UpdateProject, DeleteProject, GetTemplates, GetEnvironment, GetImports };
export { CreateProjectCommand, UpdateProjectCommand };
