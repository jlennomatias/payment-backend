import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { LocalInstrumentType } from 'src/features/payments/enums/local-instrument.enum'
import { mapToPaymentResponseError } from 'util/responseMapper'

export function ValidateTransactionIdentification(
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'validateTransactionIdentification',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any).localInstrument
          const qrCode = (args.object as any).qrCode

          switch (relatedValue) {
            case LocalInstrumentType.MANU:
            case LocalInstrumentType.DICT:
              return !value // Não deve ser preenchido
            case LocalInstrumentType.INIC:
              return (
                typeof value === 'string' && /^[a-zA-Z0-9]{1,25}$/.test(value)
              ) // Deve conter até 25 caracteres alfanuméricos
            case LocalInstrumentType.QRES:
              if (qrCode && qrCode.includes('TxId')) {
                const txId = getTxIdFromQrCode(qrCode)
                return (
                  txId && value === txId && /^[a-zA-Z0-9]{1,25}$/.test(value)
                ) // Deve corresponder ao TxId do QR Code e conter até 25 caracteres alfanuméricos
              }
              return !value // Não deve ser preenchido se o QR Code não possui TxId
            case LocalInstrumentType.QRDN:
              return (
                typeof value === 'string' && /^[a-zA-Z0-9]{26,35}$/.test(value)
              ) // Deve conter entre 26 e 35 caracteres alfanuméricos
            default:
              return false
          }
        },
        defaultMessage(args: ValidationArguments) {
          const relatedValue = (args.object as any).localInstrument
          const qrCode = (args.object as any).qrCode
          let errorMessage = ''

          switch (relatedValue) {
            case LocalInstrumentType.MANU:
            case LocalInstrumentType.DICT:
              errorMessage = `TransactionIdentification must not be present when localInstrument is ${relatedValue}.`
              break
            case LocalInstrumentType.INIC:
              errorMessage = `TransactionIdentification is required when localInstrument is ${relatedValue} and must be up to 25 alphanumeric characters.`
              break
            case LocalInstrumentType.QRES:
              if (qrCode && qrCode.includes('TxId')) {
                errorMessage = `TransactionIdentification must match the TxId from the QR Code and be up to 25 alphanumeric characters.`
              } else {
                errorMessage = `TransactionIdentification must not be present when QR Code does not have TxId and localInstrument is ${relatedValue}.`
              }
              break
            case LocalInstrumentType.QRDN:
              errorMessage = `TransactionIdentification is required when localInstrument is ${relatedValue} and must be between 26 and 35 alphanumeric characters.`
              break
            default:
              errorMessage = `Invalid localInstrument value: ${relatedValue}.`
          }

          const errorDetail = {
            code: 'VALIDATION_ERROR',
            title: 'Validation Error',
            detail: errorMessage,
          }

          // Mapeia e lança o erro padronizado
          const errorResponse = mapToPaymentResponseError(errorDetail)
          throw new Error(JSON.stringify(errorResponse))
        },
      },
    })
  }
}

function getTxIdFromQrCode(qrCode: string): string | null {
  // Suponha que o QR Code seja uma string contendo um campo TxId=<valor>
  const match = qrCode.match(/TxId=([a-zA-Z0-9]{1,25})/)
  return match ? match[1] : null
}
