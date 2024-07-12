import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEnumType', async: false })
export class IsEnumNameConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const enumType = args.constraints[0] as any;
    const enumNames = Object.keys(enumType).filter(
      (key) => typeof enumType[key] === 'number',
    );
    return enumNames.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const enumType = args.constraints[0] as any;

    const enumNames = Object.keys(enumType).filter(
      (key) => typeof enumType[key] === 'number',
    );
    return `${args.property} deve ser um nome de enum válido, valores: ${enumNames}`;
  }
}

export function IsEnumType(
  enumObject: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumObject],
      validator: IsEnumNameConstraint,
    });
  };
}
