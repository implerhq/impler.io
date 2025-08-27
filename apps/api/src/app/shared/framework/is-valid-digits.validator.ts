/* eslint-disable multiline-comment-style */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isValidDigits', async: false })
export class IsValidDigitsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === undefined || value === null || value === '') {
      return true;
    }

    const strValue = String(value).replace(/[^0-9]/g, '');

    if (strValue === '' || isNaN(Number(strValue))) {
      return false;
    }

    const validation = args.object as any;
    const numDigits = strValue.length;

    // if (validation.min !== undefined && numDigits < validation.min) {
    //   console.log(`Validation failed: Number has fewer than ${validation.min} digits`);
    //   return false;
    // }

    if (validation.max !== undefined && numDigits > validation.max) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const validation = args.object as any;

    if (validation.min !== undefined && validation.max !== undefined) {
      return `Number must have between ${validation.min} and ${validation.max} digits`;
    } else if (validation.min !== undefined) {
      return `Number must have at least ${validation.min} digits`;
    } else if (validation.max !== undefined) {
      return `Number must have at most ${validation.max} digits`;
    }

    return 'Invalid number of digits';
  }
}
