import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCountryDto } from '../dtos/create-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function CreateCountrySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a country',
      description: 'Create a new country',
    }),
    ApiResponse({
      status: 201,
      type: CountryResponseDto,
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
            CountryCodeRequired: {
              summary: 'Country code is required',
              value: {
                errors: [{ message: 'countryCode should not be empty' }],
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Country already exists',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NameExists: {
              summary: 'Country name already taken',
              value: {
                errors: [{ message: 'Country name is already registered' }],
              },
            },
            CodeExists: {
              summary: 'Country code already taken',
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
    ApiBody({ type: CreateCountryDto }),
  );
}
