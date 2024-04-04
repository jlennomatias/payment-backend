import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NoutFoundError } from 'src/erros';

@Catch(NoutFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NoutFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}
