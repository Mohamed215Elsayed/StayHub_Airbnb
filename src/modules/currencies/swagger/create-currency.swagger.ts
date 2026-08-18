import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function CreateCurrencySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a currency',
      description: 'Create a new currency',
    }),
    ApiResponse({
      status: 201,
      type: CurrencyResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NameRequired: {
              summary: 'Name is required',
              value: { errors: [{ message: 'name should not be empty' }] },
            },
            CurrencyCodeRequired: {
              summary: 'Currency code is required',
              value: {
                errors: [{ message: 'currencyCode should not be empty' }],
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Currency already exists',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            CurrencyExists: {
              summary: 'Currency already exists',
              value: {
                errors: [{ message: 'Currency already exists' }],
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            InternalError: {
              summary: 'Internal server error',
              value: { errors: [{ message: 'Internal server error' }] },
            },
          },
        },
      },
    }),
    ApiBody({ type: CreateCurrencyDto }),
  );
}
