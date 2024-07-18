import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { LocalInstrumentType } from 'src/features/payments/enums/local-instrument.enum'

export function ValidateProxy(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'validateProxy',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any).localInstrument
          if (relatedValue === LocalInstrumentType.MANU && value) {
            return false
          }
          if (
            [
              LocalInstrumentType.INIC,
              LocalInstrumentType.DICT,
              LocalInstrumentType.QRDN,
              LocalInstrumentType.QRES,
            ].includes(relatedValue) &&
            !value
          ) {
            return false
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          const relatedValue = (args.object as any).localInstrument
          if (relatedValue === LocalInstrumentType.MANU) {
            return `Proxy must not be present when localInstrument is ${relatedValue}.`
          }
          return `Proxy is required when localInstrument is ${relatedValue}.`
        },
      },
    })
  }
}
