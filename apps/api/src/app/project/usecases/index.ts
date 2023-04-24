import { CreateProject } from './create-project/create-project.usecase';
import { CreateProjectCommand } from './create-project/create-project.command';
import { GetProjects } from './get-projects/get-projects.usecase';
import { UpdateProject } from './update-project/update-project.usecase';
import { UpdateProjectCommand } from './update-project/update-project.command';
import { DeleteProject } from './delete-project/delete-project.usecase';
import { GetTemplates } from './get-templates/get-templates.usecase';

export const USE_CASES = [
  GetProjects,
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetTemplates,
  //
];

export { CreateProject, GetProjects, UpdateProject, DeleteProject, GetTemplates };
export { CreateProjectCommand, UpdateProjectCommand };
