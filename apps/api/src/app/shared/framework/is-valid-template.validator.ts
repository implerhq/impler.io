import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { TemplateRepository, CommonRepository } from '@impler/dal';

@ValidatorConstraint({ name: 'IsValidTemplate', async: true })
export class IsValidTemplateValidator implements ValidatorConstraintInterface {
  private templateRepository: TemplateRepository;
  private commonRepository: CommonRepository;
  constructor() {
    this.templateRepository = new TemplateRepository();
    this.commonRepository = new CommonRepository();
  }

  async validate(value: string) {
    const isMongoId = this.commonRepository.validMongoId(value);
    const count = await this.templateRepository.count(isMongoId ? { _id: value } : { code: value });

    return !!count;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} is not valid TemplateID or CODE`;
  }
}
