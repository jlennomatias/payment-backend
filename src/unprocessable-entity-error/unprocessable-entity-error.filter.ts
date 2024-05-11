import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UnprocessableEntityError } from 'src/erros';

@Catch(UnprocessableEntityError)
export class NotEqualErrorFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).json({
      code: exception.code,
      title: exception.title,
      detail: exception.detail,
    });
  }
}
