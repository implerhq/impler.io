import { Types } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { Member } from '../member';
import { ProjectEntity } from './project.entity';
import { Project } from './project.schema';

export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor() {
    super(Project, ProjectEntity);
  }

  async getUserProjects(_userId: string): Promise<ProjectEntity[]> {
    const members = await Member.aggregate([
      {
        $match: {
          _userId: new Types.ObjectId(_userId),
        },
      },
      {
        $lookup: {
          from: 'projects',
          let: {
            projectId: '$_projectId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$projectId'],
                },
              },
            },
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
          as: 'project',
        },
      },
      {
        $unwind: {
          path: '$project',
        },
      },
      {
        $project: {
          project: 1,
        },
      },
    ]);

    return members.map((member) => member.project);
  }
}
