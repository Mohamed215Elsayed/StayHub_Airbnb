import { BaseCustomException } from './base-custom.exception';
import { HttpStatus } from '@nestjs/common';

export class CustomUnprocessableEntityException extends BaseCustomException {
  status = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor(message: string) {
    super(message);
  }
}