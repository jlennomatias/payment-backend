import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { dataFormat } from 'util/library'

@Injectable()
export class PaymentInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(data => ({
        data: data,
        links: {
          self: 'http://api.example.com/payments-v4',
        },
        meta: {
          requestDateTime: dataFormat(new Date().toISOString()),
        },
      })),
    )
  }
}
