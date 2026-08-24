import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCityDto } from '../dtos/create-city.dto';
import { CityResponseDto } from '../dtos/city-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function CreateCitySwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a city',
      description: 'Create a new city. Requires SYSTEM_ADMIN role.',
    }),
    ApiResponse({
      status: 201,
      type: CityResponseDto,
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
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NameRequired: {
              summary: 'Name is required',
              value: { errors: [{ message: 'name should not be empty' }] },
            },
            CountryRequired: {
              summary: 'Country is required',
              value: { errors: [{ message: 'country should not be empty' }] },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Country does not exist',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            CountryNotFound: {
              summary: 'Country does not exist',
              value: { errors: [{ message: 'Country not found' }] },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - City already exists',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            CityExists: {
              summary: 'City already exists in this country',
              value: {
                errors: [{ message: 'City already exists in this country' }],
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
    ApiBody({ type: CreateCityDto }),
  );
}
