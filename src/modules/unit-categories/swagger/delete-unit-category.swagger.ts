import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function DeleteUnitCategorySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete unit category by ID',
    }),
    ApiParam({
      name: 'id',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      type: UnitCategoryResponseDto,
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
