import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NotEqualError } from 'src/erros';

@Catch(NotEqualError)
export class NotEqualErrorFilter implements ExceptionFilter {
  catch(exception: NotEqualError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).json({
      statusCode: 422,
      message: exception.message,
    });
  }
}
