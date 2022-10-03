import { CreateProject } from './create-project/create-project.usecase';
import { GetProjects } from './get-projects/get-projects.usecase';
import { UpdateProject } from './update-project/update-project.usecase';

export const USE_CASES = [
  GetProjects,
  CreateProject,
  UpdateProject,
  //
];
