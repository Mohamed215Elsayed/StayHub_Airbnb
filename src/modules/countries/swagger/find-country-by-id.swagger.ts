import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindCountryByIdSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get country by ID',
      description: 'Retrieve a single country by its MongoDB ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Country MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      description: 'Country found successfully',
      type: CountryResponseDto,
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
    }),
  );
}
