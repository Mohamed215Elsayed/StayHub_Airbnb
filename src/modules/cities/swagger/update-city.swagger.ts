import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateCityDto } from '../dtos/update-city.dto';
import { CityResponseDto } from '../dtos/city-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function UpdateCitySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update city by ID',
      description: 'Update an existing city by its ID',
    }),
    ApiParam({ name: 'id', type: String }),
    ApiBody({ type: UpdateCityDto }),
    ApiResponse({ status: 200, type: CityResponseDto }),
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
      description: 'Not Found - City does not exist',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'City not found',
              value: { errors: [{ message: 'City not found' }] },
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
  );
}
