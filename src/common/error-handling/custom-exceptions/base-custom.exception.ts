/**
 * Base class for all custom application exceptions.
 * Subclasses must define their own `status` and are automatically
 * caught and formatted by CustomExceptionFilter.
 */
import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { CustomI18nService } from '@i18n/custom-i18n.service';

export abstract class BaseCustomException extends Error {
  abstract status: HttpStatus;

  protected constructor(message: string) {
    super(message);
    // Ensures error.name reflects the actual subclass (e.g. "ForbiddenException")
    // instead of the generic "Error" — useful for logging.
    this.name = this.constructor.name;
  }

  formatError(i18n: CustomI18nService): ErrorResponse[] {
    return [{ message: i18n.translate(this.message) }];
  }
}
