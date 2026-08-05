import { HttpStatus } from '@nestjs/common';
import { BaseCustomException } from './base-custom.exception';

export class CustomConflictException extends BaseCustomException {
  status = HttpStatus.CONFLICT;

  constructor(message: string) {
    super(message);
  }
}