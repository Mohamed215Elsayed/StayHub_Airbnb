import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateCountryDto } from '../dtos/update-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function UpdateCountrySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update country by ID',
      description: 'Update an existing country by its ID',
    }),
    ApiParam({ name: 'id', type: String }),
    ApiBody({ type: UpdateCountryDto }),
    ApiResponse({ status: 200, type: CountryResponseDto }),
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
