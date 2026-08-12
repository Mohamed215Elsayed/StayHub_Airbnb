import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { PinoLogger } from './pino.logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(PinoLogger) private readonly logger: PinoLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl, body, ip, headers } = req;
    const startTime = Date.now();
    const requestId = req.header('x-request-id') || uuid();

    let responseData: any;
    let isError = false;

    return next.handle().pipe(
      tap({
        next: (data) => {
          responseData = data;
        },
        error: () => {
          isError = true;
        },
      }),

      finalize(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        const logData: any = {
          requestId,
          method,
          url: originalUrl,
          statusCode,
          duration: `${duration}ms`,
          ip:
            (headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            ip ||
            'unknown',
          userAgent: headers['user-agent'] || 'unknown',
        };

        if (
          ['POST', 'PUT', 'PATCH'].includes(method) &&
          body &&
          Object.keys(body).length > 0
        ) {
          const sanitized = { ...body };
          const sensitiveFields = [
            'password',
            'confirmPassword',
            'oldPassword',
            'newPassword',
            'refreshToken',
            'accessToken',
          ];
          sensitiveFields.forEach((field) => {
            if (sanitized[field]) delete sanitized[field];
          });
          logData.requestBody = sanitized;
        }

        if (!isError && responseData !== undefined && responseData !== null) {
          try {
            const stringified = JSON.stringify(responseData);
            if (stringified.length < 1000) {
              if (
                !res
                  .getHeader('content-disposition')
                  ?.toString()
                  .includes('attachment')
              ) {
                logData.responseBody = responseData;
              }
            } else {
              logData.responseBody = '[Large Response - Omitted]';
            }
          } catch (e) {
            logData.responseBody = '[Non-Serializable Response]';
          }
        }

        const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms ${requestId}`;
        if (statusCode >= 500) {
          this.logger.error(message, undefined, 'HTTP');
          this.logger.error(JSON.stringify(logData), undefined, 'HTTP-DETAIL');
        } else if (statusCode >= 400) {
          this.logger.warn(message, 'HTTP');
          this.logger.warn(JSON.stringify(logData), 'HTTP-DETAIL');
        } else {
          this.logger.log(message, 'HTTP');
          if (process.env.LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'verbose') {
            this.logger.debug(JSON.stringify(logData), 'HTTP-DETAIL');
          }
        }
      }),
    );
  }
}
