import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CommonRepository, ProjectEntity } from '@impler/dal';

@ValidatorConstraint({ name: 'IsUnique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  private commonRepository: CommonRepository;
  constructor() {
    this.commonRepository = new CommonRepository();
  }

  async validate(value: any, args: ValidationArguments) {
    const [modelName, field] = args.constraints;
    const count = await this.commonRepository.count<ProjectEntity>(modelName, { [field]: value });

    return !count;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} is already taken`;
  }
}
