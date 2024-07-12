import {
  Injectable,
  UnauthorizedException,
  ArgumentsHost,
} from '@nestjs/common';
import { Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
@Injectable()
export class JwtExceptionInterceptor implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    response.status(401).json({
      statusCode: 401,
      message: 'Unauthorized', // Mensagem de erro personalizada
      error: exception.message, // Mensagem de erro original, se necessário
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
