import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CityResponseDto } from '../dtos/city-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindAllCitiesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all cities',
      description: 'Retrieve a paginated list of cities',
    }),

    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'name', required: false, type: String }),
    ApiQuery({ name: 'country', required: false, type: String }),
    ApiResponse({ status: 200, type: [CityResponseDto] }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            InvalidPage: {
              summary: 'Page must be a positive integer',
              value: { errors: [{ message: 'page must be greater than 0' }] },
            },
            InvalidLimit: {
              summary: 'Limit must be a positive integer',
              value: { errors: [{ message: 'limit must be greater than 0' }] },
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
