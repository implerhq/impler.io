import { CreateProject } from './create-project/create-project.usecase';
import { CreateProjectCommand } from './create-project/create-project.command';
import { GetProjects } from './get-projects/get-projects.usecase';
import { UpdateProject } from './update-project/update-project.usecase';
import { UpdateProjectCommand } from './update-project/update-project.command';
import { DeleteProject } from './delete-project/delete-project.usecase';

import { AddMember } from './member/add-member/add-member.usecase';
import { AddMemberCommand } from './member/add-member/add-member.command';

export const USE_CASES = [
  GetProjects,
  CreateProject,
  UpdateProject,
  DeleteProject,
  // member
  AddMember,
  //
];

export { CreateProject, GetProjects, UpdateProject, DeleteProject, AddMember };
export { AddMemberCommand, CreateProjectCommand, UpdateProjectCommand };
