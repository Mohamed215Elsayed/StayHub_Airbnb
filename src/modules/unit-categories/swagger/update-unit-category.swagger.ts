import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUnitCategoryDto } from '../dtos/update-unit-category.dto';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function UpdateUnitCategorySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update unit category by ID',
    }),
    ApiParam({ name: 'id', type: String }),
    ApiBody({ type: UpdateUnitCategoryDto }),
    ApiResponse({ status: 200, type: UnitCategoryResponseDto }),
    ApiResponse({
      status: 400,
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NameRequired: {
              summary: 'Name is required',
              value: { errors: [{ message: 'name should not be empty' }] },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'Unit category not found',
              value: { errors: [{ message: 'Unit category not found' }] },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            UnitCategoryExists: {
              summary: 'Unit category already exists',
              value: {
                errors: [{ message: 'Unit category already exists' }],
              },
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
