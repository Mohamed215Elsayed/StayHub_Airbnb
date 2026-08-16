import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function DeleteCountrySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete country by ID',
      description: 'Delete an existing country by its MongoDB ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Country MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      description: 'Country deleted successfully',
      type: CountryResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Country does not exist',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'Country not found',
              value: { errors: [{ message: 'Country not found' }] },
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
