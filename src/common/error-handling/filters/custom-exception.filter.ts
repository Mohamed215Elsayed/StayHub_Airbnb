import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';
import { BaseCustomException } from '../custom-exceptions/base-custom.exception';
import { formatInputValidationErrors } from '../input-validation/format-input-validation-errors';
// import { CustomI18nService } from '../../../i18n/custom-i18n.service';
import { CustomI18nService } from '@i18n/custom-i18n.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  constructor(private readonly i18nService: CustomI18nService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // Handle custom exceptions that inherit from BaseCustomException
    if (exception instanceof BaseCustomException) {
      return response.status(exception.status).json({
        errors: exception.formatError(this.i18nService),
      });
    }

    // Handle input validation errors from class-validator (DTOs)
    if (exception instanceof I18nValidationException) {
      const formattedErrors = formatInputValidationErrors(
        exception.errors,
        this.i18nService,
      );
      return response.status(HttpStatus.BAD_REQUEST).json({
        errors: formattedErrors,
      });
    }

    // Handle built-in Nest HTTP exceptions (e.g. NotFoundException)
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'status' in exception
    ) {
      const httpException = exception as { status: number; message: unknown };
      return response.status(httpException.status).json({
        errors: [
          {
            message:
              typeof httpException.message === 'string'
                ? httpException.message
                : 'An error occurred',
          },
        ],
      });
    }

    // Unknown exceptions
    this.logger.error(exception instanceof Error ? exception.stack : exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: [
        { message: this.i18nService.translate('error.INTERNAL_SERVER_ERROR') },
      ],
    });
  }
}
