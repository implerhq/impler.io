import { BadRequestException, Injectable } from '@nestjs/common';
import { ColumnRepository, UserJobRepository, JobMappingEntity } from '@impler/dal';
import { UserJobImportStatusEnum } from '@impler/shared';
import { APIMessages } from '@shared/constants';

@Injectable()
export class GetColumnSchemaMapping {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly columnRepository: ColumnRepository
  ) {}

  async execute(_jobId: string): Promise<JobMappingEntity[]> {
    const userJob = await this.userJobRepository.findOne({ _id: _jobId });

    if (!userJob) {
      throw new BadRequestException(APIMessages.USER_JOB_NOT_FOUND);
    }

    await this.userJobRepository.update({ _id: _jobId }, { $set: { status: UserJobImportStatusEnum.MAPPING } });

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
