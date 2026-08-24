import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindCurrencyByIdSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get currency by ID',
      description: 'Retrieve a single currency by its MongoDB ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Currency MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      description: 'Currency found successfully',
      type: CurrencyResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid ID format',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            InvalidId: {
              summary: 'Invalid MongoDB ID',
              value: {
                errors: [{ message: 'Param must be a valid mongo id' }],
              },
            },
          },
        },
      },
    }),
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
    }),
  );
}
