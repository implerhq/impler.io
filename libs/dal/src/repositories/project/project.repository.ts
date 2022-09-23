import { BaseRepository } from '../base-repository';
import { ProjectEntity } from './project.entity';
import { Project } from './project.schema';

export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor() {
    super(Project, ProjectEntity);
  }
}
