import { Injectable } from '@nestjs/common';
import { TemplateRepository, ValidatorRepository } from '@impler/dal';
import { UpdateValidationsCommand } from './update-validations.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateValidations {
  constructor(private validatorRepository: ValidatorRepository, private templateRepository: TemplateRepository) {}

  async execute(_templateId: string, data: UpdateValidationsCommand) {
    const template = await this.templateRepository.findOne({ id: _templateId });
    if (!template) {
      throw new DocumentNotFoundException('Template', _templateId);
    }

    await this.validatorRepository.findOneAndUpdate(
      {
        _templateId,
      },
      {
        _templateId,
        ...data,
      },
      {
        upsert: true,
      }
    );

    return await this.validatorRepository.findOne({ _templateId });
  }
}
