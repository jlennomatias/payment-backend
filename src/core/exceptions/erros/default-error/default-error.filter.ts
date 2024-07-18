import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common'
import { DefaultError } from '../erros'

@Catch(DefaultError, BadRequestException)
export class DefaultErrorFilter implements ExceptionFilter {
  catch(exception: DefaultError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    if (exception instanceof BadRequestException) {
      const exceptionResponse: any = exception.getResponse() as any
      const errors = Array.isArray(exceptionResponse?.message)
        ? exceptionResponse.message
        : [exceptionResponse?.error]

      return response.status(422).json({
        errors,
        metata: {
          timestamp: new Date().toISOString(),
          message: exception.message,
        },
      })
    }

    response.status(422).json({
      errors: exception.errors,
      meta: exception.meta,
    })
  }
}
