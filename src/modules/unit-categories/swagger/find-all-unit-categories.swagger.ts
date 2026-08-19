import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindAllUnitCategoriesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all unit categories',
    }),

    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'name', required: false, type: String }),
    ApiResponse({ status: 200, type: [UnitCategoryResponseDto] }),
    ApiResponse({
      status: 400,
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
