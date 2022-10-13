import { CommonRepository, TemplateRepository } from '@impler/dal';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { APIMessages } from '../constants';

@Injectable()
export class ValidateTemplate implements PipeTransform<string> {
  constructor(private commonRepository: CommonRepository, private templateRepository: TemplateRepository) {}

  async transform(value: string): Promise<string> {
    const isMongoId = this.commonRepository.validMongoId(value);
    const template = await this.templateRepository.findOne(isMongoId ? { _id: value } : { code: value });
    if (!template) throw new BadRequestException(`${value} ${APIMessages.INVALID_TEMPLATE_ID_CODE_SUFFIX}`);

    return template._id;
  }
}
