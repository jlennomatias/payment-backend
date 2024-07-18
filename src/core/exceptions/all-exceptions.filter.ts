import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    console.log(exception)

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message: string = exception?.response?.message || exception.message

    const stack: string = exception?.stack

    const data = { ...exception?.response?.data, stack }

    const resBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      data,
    }

    response.status(status).json(resBody)
  }
}
