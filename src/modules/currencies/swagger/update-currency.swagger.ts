import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateCurrencyDto } from '../dtos/update-currency.dto';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function UpdateCurrencySwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update currency by ID',
      description:
        'Update an existing currency by its ID. Requires SYSTEM_ADMIN role.',
    }),
    ApiParam({
      name: 'id',
      description: 'Currency MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiBody({ type: UpdateCurrencyDto }),
    ApiResponse({ status: 200, type: CurrencyResponseDto }),
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
      description: 'Bad Request - Validation errors',
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
      description: 'Not Found - Currency does not exist',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'Currency not found',
              value: { errors: [{ message: 'Currency not found' }] },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Currency already exists',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            CurrencyExists: {
              summary: 'Currency already exists',
              value: {
                errors: [{ message: 'Currency already exists' }],
              },
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
