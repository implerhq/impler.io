import { Types } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { ProjectEntity } from './project.entity';
import { Project } from './project.schema';

export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor() {
    super(Project, ProjectEntity);
  }

  async getUserProjects(_userId: string): Promise<ProjectEntity[]> {
    return this.find({
      _userId: new Types.ObjectId(_userId),
    });
  }
  async getUserOfProject(_projectId: string): Promise<ProjectEntity> {
    return Project.findOne({ _id: _projectId }, '_userId').populate('_userId', 'email');
  }
}
