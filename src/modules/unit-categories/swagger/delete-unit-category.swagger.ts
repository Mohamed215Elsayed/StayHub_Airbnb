import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function DeleteUnitCategorySwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete unit category by ID',
      description:
        'Delete an existing unit category by its MongoDB ID. Requires SYSTEM_ADMIN role.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unit Category MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiResponse({
      status: 200,
      type: UnitCategoryResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Missing or invalid token',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NoToken: {
              summary: 'Authorization header missing',
              value: { errors: [{ message: 'No token provided' }] },
            },
            InvalidToken: {
              summary: 'Token malformed or expired',
              value: { errors: [{ message: 'Invalid or expired token' }] },
            },
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient role (requires SYSTEM_ADMIN)',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            Forbidden: {
              summary: 'User does not have SYSTEM_ADMIN role',
              value: { errors: [{ message: 'Forbidden' }] },
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
