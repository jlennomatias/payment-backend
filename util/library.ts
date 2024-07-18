import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import * as process from 'node:process'
import * as crypto from 'node:crypto'

export type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
  ? U[K]
  : K extends keyof T
  ? T[K]
  : never
}

export type ErrorType = {
  errorData: string
  originPayload?: string
  errorOrigin?: string
  errorDetailMessage?: string
  errorReturnCode?: string
  integrationId?: string
}

type Capitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S

// Helper type to convert a snake_case string to camelCase
type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S

// Type to convert all properties of an object from snake_case to camelCase
export type ToCamelCase<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K] extends object
  ? ToCamelCase<T[K]>
  : T[K]
}

export const isErrorType = data => {
  return typeof data === 'object' && data?.errorData
}

export const toInt = (value: any): number | undefined => {
  if (value == 0) {
    return 0
  }

  if (!value) {
    return undefined
  }

  try {
    return parseInt(value, 10)
  } catch (e: any) {
    return undefined
  }
}

export const validateDocument = (document: string) => {
  const isCpf = validateCpf(document.slice(-11))
  const isCnpj = validateCnpj(document)

  return { isCpf, isCnpj }
}

export const validateCpf = (document: string) => {
  if (/^(\d)\1{10}$/.test(document)) {
    return false
  }

  // Calcular o primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(document.charAt(i)) * (10 - i)
  }
  let digito1 = 11 - (soma % 11)
  if (digito1 > 9) {
    digito1 = 0
  }

  // Verificar se o primeiro dígito verificador está correto
  if (parseInt(document.charAt(9)) !== digito1) {
    return false
  }

  // Calcular o segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(document.charAt(i)) * (11 - i)
  }
  let digito2 = 11 - (soma % 11)
  if (digito2 > 9) {
    digito2 = 0
  }

  // Verificar se o segundo dígito verificador está correto
  if (parseInt(document.charAt(10)) !== digito2) {
    return false
  }

  // Se passar por todas as verificações, o document é válido
  return true
}
export const validateCnpj = (document: string) => {
  let soma = 0
  let peso = 5
  for (let i = 0; i < 12; i++) {
    soma += parseInt(document.charAt(i)) * peso
    peso = peso === 2 ? 9 : peso - 1
  }
  let digito1 = 11 - (soma % 11)
  if (digito1 > 9) {
    digito1 = 0
  }

  // Verificar se o primeiro dígito verificador está correto
  if (parseInt(document.charAt(12)) !== digito1) {
    return false
  }

  // Calcular o segundo dígito verificador
  soma = 0
  peso = 6
  for (let i = 0; i < 13; i++) {
    soma += parseInt(document.charAt(i)) * peso
    peso = peso === 2 ? 9 : peso - 1
  }
  let digito2 = 11 - (soma % 11)
  if (digito2 > 9) {
    digito2 = 0
  }

  // Verificar se o segundo dígito verificador está correto
  if (parseInt(document.charAt(13)) !== digito2) {
    return false
  }

  // Se passar por todas as verificações, o document é válido
  return true
}

export const convertToMoneyValue = (value: string): number => {
  if (!/^\d{15}$/.test(value)) {
    throw new BadRequestException(`Invalid input format: ${value}`)
  }

  const [integerValue, decimalValue] = [value.slice(0, -2), value.slice(-2)]

  return parseFloat(`${parseInt(integerValue, 10)}.${decimalValue}`)
}

export const prepareErrorData = (
  error: Error,
  requestPayload?: object,
  errorOrigin?: string,
  errorDetailMessage?: string,
  errorReturnCode?: string,
  integrationId?: string,
): ErrorType => {
  return {
    errorData: `
      Message: ${error.message}, Stack: ${error.stack}
    `.replace(/'/g, ''),
    originPayload: requestPayload ? JSON.stringify(requestPayload) : null,
    errorOrigin: errorOrigin ?? null,
    errorDetailMessage: errorDetailMessage
      ? errorDetailMessage.replace(/'/g, '')
      : null,
    errorReturnCode,
    integrationId,
  }
}

export const hourDifferenceBetweenDates = (
  initialDate: Date,
  hourDifference: number,
) => {
  const currentTime = new Date()

  const diffInMilliseconds =
    currentTime.getTime() - new Date(initialDate).getTime()
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60)

  return diffInHours > hourDifference
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export function mergeObject<T>(defaultObj: T, partialObj: DeepPartial<T>): T {
  const merge = (baseObj: any, updates: any): any => {
    const result = { ...baseObj }
    for (const key in updates) {
      if (updates[key] !== undefined) {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          result[key] = merge(baseObj[key], updates[key])
        } else {
          result[key] = updates[key]
        }
      }
    }
    return result
  }

  return merge(defaultObj, partialObj)
}

function extractConstraintsErrors(data) {
  const errors = []

  function extractErrorsRecursive(obj) {
    if (obj.constraints) {
      for (const key in obj.constraints) {
        errors.push(obj.constraints[key])
      }
    }

    if (obj.children) {
      obj.children.forEach(child => extractErrorsRecursive(child))
    }
  }

  data.forEach(item => extractErrorsRecursive(item))

  return errors
}

export const validateContraints = async <T>(
  clazz: ClassConstructor<T>,
  values: any,
) => {
  try {
    const instance = plainToInstance(clazz, values)
    // @ts-expect-error error expected
    const validationErrors = await validate(instance)

    if (validationErrors.length) {
      const validations = extractConstraintsErrors(validationErrors)
      throw new BadRequestException(validations.join('. '))
    }
  } catch (err) {
    if (err instanceof HttpException) {
      throw err
    }
  }
}

export const getQueryFromUrl = (urlReceived: string): Record<string, any> => {
  try {
    const parsed = new URL(urlReceived)

    return Array.from(parsed.searchParams.entries()).reduce(
      (previous, current) => ({ ...previous, [current[0]]: current[1] }),
      {},
    )
  } catch {
    return {}
  }
}

export const createHashContent = (value: any): string => {
  const jsonString = JSON.stringify(value)

  const hash = crypto.createHash('sha256')

  hash.update(jsonString)

  return hash.digest('hex')
}

export const getErrorTypeMessage = (errorData: ErrorType) => {
  if (
    errorData.errorReturnCode.includes(' - ') &&
    !Number.isNaN(Number(String(errorData.errorReturnCode).substring(0, 3)))
  ) {
    return {
      statusCode: Number(errorData?.errorReturnCode?.split(' - ')?.[0]),
      message:
        errorData?.errorDetailMessage ||
        errorData?.errorReturnCode?.split(' - ')?.[1],
    }
  }
  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: errorData?.errorDetailMessage,
  }
}

export const isDevelopment = () =>
  (process.env.NODE_ENV ?? 'development') === 'development'

export const dataFormat = (params: string) => {
  return params.split('.')[0] + 'Z'
}

export const dataFormatEndToEnd = (params: string) => {
  return params.substring(9, 17).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
}

function formatDateBRtoISO(dateStr: string) {
  const [day, month, year] = dateStr.substring(0, 10).split('/')
  return `${year}-${month}-${day}`
}

export const convertStatus = (dataPayment: any) => {
  const currentDate = new Date().toLocaleString('pt-BR')
  const dataAtual = formatDateBRtoISO(currentDate)

  return dataAtual >= dataPayment ? 'RCVD' : 'SCHD'
}

export const validateConsult = (creditorOPF: any, creditorPix: any) => {
  if (
    creditorOPF.number.slice(0, -1) !== creditorPix.accountNumber ||
    creditorOPF.ispb !== creditorPix.bankCode ||
    creditorOPF.issuer !== creditorPix.branchCode ||
    creditorOPF.number.slice(-1) !== creditorPix.checkDigit
  ) {
    return false
  }
  return true
}

export const converterLocalInstrumentPix = value =>
  ({
    MANU: 'MANUAL',
    DICT: 'DICT',
    QRES: 'STATIC_QRCODE',
    QRDN: 'DYNAMIC_QRCODE',
    INIC: 'PAYMENT_INITIATOR',
  })[value]

export const converterAcountPix = value =>
  ({
    CACC: 'CHECKING_ACCOUNT',
    SVGS: 'SAVINGS_ACCOUNT',
    TRAN: 'TRANSACTIONAL_ACCOUNT',
    SLRY: 'SALARY_ACCOUNT',
  })[value]

export const converterStatusPix = value =>
  ({
    PROCESSING: 'PROCESSING',
    COMPLETED: 'ACSC',
    ERROR: 'RJCT',
    FAILED: 'FAIL',
    CANCELLED: 'CANC',
    SCHEDULED: 'SCHD',
  })[value]

export function convertToEnum<T extends object>(
  value: string,
  enumType: T,
): T[keyof T] | undefined {
  if (value in enumType) {
    return enumType[value as keyof T]
  }
  return undefined
}
