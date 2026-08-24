import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUnitCategoryDto } from '../dtos/create-unit-category.dto';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function CreateUnitCategorySwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a unit category',
      description: 'Create a new unit category. Requires SYSTEM_ADMIN role.',
    }),
    ApiResponse({
      status: 201,
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
    ApiBody({ type: CreateUnitCategoryDto }),
  );
}
