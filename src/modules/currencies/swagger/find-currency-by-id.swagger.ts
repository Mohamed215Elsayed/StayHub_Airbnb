import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindCurrencyByIdSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get currency by ID',
      description: 'Retrieve a single currency by its ID',
    }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({ status: 200, type: CurrencyResponseDto }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Currency does not exist',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'Currency not found',
              value: { errors: [{ message: 'Currency not found' }] },
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
  );
}