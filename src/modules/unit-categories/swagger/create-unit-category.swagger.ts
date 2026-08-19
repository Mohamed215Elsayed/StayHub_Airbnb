import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function CreateUnitCategorySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a unit category',
    }),
    ApiResponse({
      status: 201,
      type: UnitCategoryResponseDto,
    }),
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
