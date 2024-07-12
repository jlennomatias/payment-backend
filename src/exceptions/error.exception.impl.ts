import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseException } from './error.exception';

@Catch(ErrorResponseException)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorResponseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const requestDateTime = new Date().toISOString();

    response.status(exception.status).json({
      errors: [
        {
          code: exception.code,
          title: exception.title,
          detail: exception.description,
        },
      ],
      meta: {
        requestDateTime: requestDateTime,
      },
    });
  }
}
