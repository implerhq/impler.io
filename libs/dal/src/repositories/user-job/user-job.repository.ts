import { UserJob } from './user-job.schema';
import { UserJobEntity } from './user-job.entity';
import { BaseRepository } from '../base-repository';
import { Environment } from '../environment';
import { TemplateEntity } from '../template';

export class UserJobRepository extends BaseRepository<UserJobEntity> {
  constructor() {
    super(UserJob, UserJobEntity);
  }
  async getUserEmailFromJobId(jobId: string): Promise<string> {
    const uploadInfoWithTemplate = await UserJob.findById(jobId).populate([
      {
        path: '_templateId',
      },
    ]);
    const environment = await Environment.find({
      _projectId: (uploadInfoWithTemplate._templateId as unknown as TemplateEntity)._projectId,
    }).populate([
      {
        path: 'apiKeys._userId',
      },
    ]);

    return environment[0].apiKeys[0]._userId.email;
  }
}
