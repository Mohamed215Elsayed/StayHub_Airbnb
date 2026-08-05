import { BaseCustomException } from './base-custom.exception';
import { HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends BaseCustomException {
  status = HttpStatus.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
