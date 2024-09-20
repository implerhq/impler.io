import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Check if value exists
          if (value === undefined || value === null) {
            return true;
          }
          // If related value doesn't exist, consider validation passed
          if (relatedValue === undefined || relatedValue === null) {
            return true;
          }

          // Both values exist, perform comparison
          return typeof value === 'number' && typeof relatedValue === 'number' && value > relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;

          return `${args.property} must exist and be greater than ${relatedPropertyName}`;
        },
      },
    });
  };
}
