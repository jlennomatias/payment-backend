import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorsCode, ErrorsTitleCode } from 'utils/enum/enum_errors';

@Catch(HttpException)
export class ParamsExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    try {
      let errors = [];

      const responseObject = exception.getResponse();
      if (
        responseObject instanceof Object &&
        responseObject !== null &&
        'message' in responseObject
      ) {
        const messages = responseObject['message'] as Array<string>;

        errors = messages.map((error) => ({
          code: error.includes('should not be empty')
            ? ErrorsCode.PARAMETRO_NAO_INFORMADO
            : ErrorsCode.PARAMETRO_INVALIDO,
          title: error.includes('should not be empty')
            ? ErrorsTitleCode.PARAMETRO_NAO_INFORMADO
            : ErrorsTitleCode.PARAMETRO_INVALIDO,
          detail: error,
        }));
      }

      response.status(status).json({
        errors: errors,
        meta: {
          requestDateTime: new Date().toISOString(),
        },
      });
    } catch (error) {
      response.status(status).json({
        errors: error,
        meta: {
          requestDateTime: new Date().toISOString(),
        },
      });
    }
  }
}
