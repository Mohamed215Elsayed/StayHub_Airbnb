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
import { UpdateCountryDto } from '../dtos/update-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function UpdateCountrySwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update country by ID',
      description:
        'Update an existing country by its ID. Requires SYSTEM_ADMIN role.',
    }),
    ApiParam({
      name: 'id',
      description: 'Country MongoDB ID',
      type: String,
      example: '60d21b4967d0d8992e610c85',
    }),
    ApiBody({ type: UpdateCountryDto }),
    ApiResponse({ status: 200, type: CountryResponseDto }),
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
      description: 'Country not found',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'Country not found',
              value: { errors: [{ message: 'Country not found' }] },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Country name or code already registered',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            DuplicateName: {
              summary: 'Country name already registered',
              value: {
                errors: [{ message: 'Country name is already registered' }],
              },
            },
            DuplicateCode: {
              summary: 'Country code already registered',
              value: {
                errors: [{ message: 'Country code is already registered' }],
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
