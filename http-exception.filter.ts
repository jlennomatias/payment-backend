import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
// import { ErrorsCodePayment, ErrorsTitlePayment } from 'utils/enum_pix';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // let errors = [];

    // const responseObject = exception.getResponse();
    // if (
    //   responseObject instanceof Object &&
    //   responseObject !== null &&
    //   'message' in responseObject
    // ) {
    //   const messages = responseObject['message'] as Array<string>;

    //   errors = messages.map((errors) => ({
    //     code: ErrorsCodePayment.PARAMETRO_INVALIDO,
    //     title: ErrorsTitlePayment.PARAMETRO_INVALIDO,
    //     detail: errors,
    //   }));
    // }

    response.status(status).json({
      errors: exception,
      meta: {
        requestDateTime: new Date().toISOString(),
      },
    });
  }
}
