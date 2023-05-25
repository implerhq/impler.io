import { Types } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { TemplateEntity } from './template.entity';
import { Template } from './template.schema';

export class TemplateRepository extends BaseRepository<TemplateEntity> {
  constructor() {
    super(Template, TemplateEntity);
  }

  async getProjectTemplateIds(_projectId: string, name?: string): Promise<string[]> {
    const ids = await this.find(
      {
        _projectId: new Types.ObjectId(_projectId),
        ...(name
          ? {
              name: {
                $regex: name || '',
                $options: 'i',
              },
            }
          : {}),
      },
      '_id'
    );

    return ids?.map((id) => id._id);
  }
}
