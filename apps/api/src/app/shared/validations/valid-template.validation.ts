import { TemplateRepository } from '@impler/dal';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { APIMessages } from '../constants';

@Injectable()
export class ValidateTemplate implements PipeTransform<string> {
  constructor(private templateRepository: TemplateRepository) {}

  async transform(value: string): Promise<string> {
    const template = await this.templateRepository.findOne({ _id: value });
    if (!template) throw new BadRequestException(`${value} ${APIMessages.INVALID_TEMPLATE_ID_CODE_SUFFIX}`);

    return template._id;
  }
}
