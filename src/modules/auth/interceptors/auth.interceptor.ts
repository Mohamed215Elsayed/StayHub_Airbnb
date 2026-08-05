import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// تعريف نوع الـ Response الموحد
export interface StandardResponse<T = unknown> {
  success: boolean;
  data: T;
  // يمكن إضافة timestamp أو meta لو احتجت
  // timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        // timestamp: new Date().toISOString(),
      })),
    );
  }
}
