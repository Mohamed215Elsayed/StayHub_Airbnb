import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from '../data-access';

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    totalCount: number;
    page: number | undefined;
    limit: number | undefined;
    pageCount: number;
  };
}

/**
 * Normalizes controller responses into a consistent API envelope.
 *
 * Rules:
 * - `null` / `undefined`  → `{ data: [] }`
 * - `PaginatedResult<T>`  → `{ data, meta: { totalCount, page, limit, pageCount } }`
 * - anything else         → `{ data }`
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor<unknown, ApiResponse<unknown>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(map((response) => this.normalize(response)));
  }

  private normalize(response: unknown): ApiResponse<unknown> {
    if (response == null) {
      return { data: [] };
    }

    if (response instanceof PaginatedResult) {
      const { data, totalCount, page, limit, pageCount } = response;
      return { data, meta: { totalCount, page, limit, pageCount } };
    }

    return { data: response };
  }
}
