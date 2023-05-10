import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { UpdateImportCountCommand } from './update-import-count.command';

@Injectable()
export class UpdateImportCount {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(_templateId: string, command: UpdateImportCountCommand) {
    return await this.templateRepository.findOneAndUpdate(
      {
        _id: _templateId,
      },
      {
        $inc: {
          totalUploads: 1,
          totalRecords: command.totalRecords,
          totalInvalidRecords: command.totalInvalidRecords,
        },
      }
    );
  }
}
