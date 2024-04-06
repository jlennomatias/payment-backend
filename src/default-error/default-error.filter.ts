import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DefaultError } from 'src/erros';

@Catch(DefaultError)
export class DefaultErrorFilter implements ExceptionFilter {
  catch(exception: DefaultError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).json({
      statusCode: 422,
      message: exception.message,
    });
  }
}
