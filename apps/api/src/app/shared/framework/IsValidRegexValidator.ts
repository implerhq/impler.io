import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsValidRegex' })
export class IsValidRegex implements ValidatorConstraintInterface {
  validate(text: string) {
    try {
      new RegExp(text);

      return true;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Text (${args.value}) is not valid Regular expression!`;
  }
}
