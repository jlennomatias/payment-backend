import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AppLogger } from '@core/logging/app-logger'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(protected readonly appLooger: AppLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = Number(exception.getStatus())
    const exceptionResponse = exception.getResponse()

    this.appLooger.error(exception)

    const message = [
      //@ts-expect-error error is expected
      exceptionResponse?.message
        ? //@ts-expect-error error is expected
          exceptionResponse?.message
        : exception?.message,
    ]
      .flat()
      .join(' ')

    const notFoundMessage = 'Not Found'

    if (status === HttpStatus.NOT_FOUND && message === notFoundMessage) {
      return response.status(Number.isNaN(status) ? 500 : status).send()
    }

    response.status(Number.isNaN(status) ? 500 : status).json({
      message,
      statusCode: Number.isNaN(status) ? 500 : status,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: exceptionResponse,
    })
  }
}
