import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateIndexes implements PipeTransform<string> {
  transform(value: string): string {
    if (value && /^[0-9]+(,[0-9]+)*$/.test(value)) {
      return value;
    }
    throw new BadRequestException();
  }
}
