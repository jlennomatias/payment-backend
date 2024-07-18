import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { UnprocessableEntityError } from '../erros'

@Catch(UnprocessableEntityError)
export class UnprocessableEntityErrorFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(422).json({
      code: exception.code,
      title: exception.title,
      detail: exception.detail,
    })
  }
}
