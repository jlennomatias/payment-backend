import {
  ErrorsCode,
  ErrorsStatusCode,
  ErrorsTitleCode,
} from 'utils/enum/enum_errors';
import { EnumRejectionReason } from 'utils/enum/enum_pix';

export class ErrorResponseException extends Error {
  public readonly code: string;
  public readonly title: string;
  public readonly description: string;
  public readonly status: number;

  constructor(code: string, description: string) {
    super(description);
    this.code = code;
    this.title = ErrorsTitleCode[code];
    this.description = description;
    this.status = ErrorsStatusCode[code] || 400;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorException extends Error {
  public readonly code: ErrorsCode;
  public readonly description: string;
  public readonly data?: any;

  constructor(code: ErrorsCode, description: string, data?: any) {
    super(description);
    this.code = code;
    this.description = description;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorPaymentException extends Error {
  public readonly code: EnumRejectionReason;
  public readonly description: string;
  public readonly data: any;

  constructor(code: EnumRejectionReason, description: string, data?: any) {
    super(description);
    this.code = code;
    this.description = description;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}
