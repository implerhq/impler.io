import { CommonRepository } from '@impler/dal';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  private commonRepository: CommonRepository;
  constructor() {
    this.commonRepository = new CommonRepository();
  }

  transform(value: string): string {
    if (value && this.commonRepository.validMongoId(value)) {
      return value;
    }
    throw new BadRequestException();
  }
}
