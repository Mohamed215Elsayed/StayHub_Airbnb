import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CityResponseDto } from '../dtos/city-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindCityByIdSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get city by ID',
      description: 'Retrieve a single city by its MongoDB ID',
    }),
    ApiParam({
      name: 'id',
      description: 'City MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      description: 'City found successfully',
      type: CityResponseDto,
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
    }),
  );
}
