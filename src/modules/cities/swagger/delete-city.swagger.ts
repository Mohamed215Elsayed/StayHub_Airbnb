import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CityResponseDto } from '../dtos/city-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function DeleteCitySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete city by ID',
      description: 'Delete an existing city by its MongoDB ID',
    }),
    ApiParam({
      name: 'id',
      description: 'City MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      description: 'City deleted successfully',
      type: CityResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - City does not exist',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'City not found',
              value: { errors: [{ message: 'City not found' }] },
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
