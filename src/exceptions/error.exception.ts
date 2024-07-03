import {
  ErrorsCode,
  ErrorsStatusCode,
  ErrorsTitleCode,
} from 'utils/enum_errors';

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
    this.status = ErrorsStatusCode[code];
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorException extends Error {
  public readonly code: ErrorsCode;
  public readonly description: string;

  constructor(code: ErrorsCode, description: string) {
    super(description);
    this.code = code;
    this.description = description;
    Error.captureStackTrace(this, this.constructor);
  }
}
