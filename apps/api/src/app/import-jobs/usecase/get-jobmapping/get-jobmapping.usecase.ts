import { Injectable } from '@nestjs/common';
import { ColumnRepository, UserJobRepository, JobMappingEntity } from '@impler/dal';

@Injectable()
export class GetJobMapping {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly columnRepository: ColumnRepository
  ) {}

  async execute(_jobId: string): Promise<JobMappingEntity[]> {
    const userJob = await this.userJobRepository.findOne({ _id: _jobId });

    if (!userJob) {
      throw new Error('User job not found');
    }

    const columns = await this.columnRepository.find({ _templateId: userJob._templateId });
    const jobsMapping = columns.map((column) => ({
      key: column.key,
      name: column.name,
      isRequired: column.isRequired,
      path: undefined,
      _jobId,
    }));

    return jobsMapping;
  }
}
