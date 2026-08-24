import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindAllCountriesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all countries',
      description: 'Retrieve a paginated list of all non-deleted countries',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (1-based). Defaults to 1.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page. Defaults to 10.',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Filter by country name.',
    }),
    ApiQuery({
      name: 'countryCode',
      required: false,
      type: String,
      description: 'Filter by country code.',
    }),
    ApiQuery({
      name: 'ignoreLimit',
      required: false,
      type: Boolean,
      description: 'When true, ignores the limit and returns all results.',
    }),
    ApiResponse({
      status: 200,
      description: 'Countries retrieved successfully',
      type: [CountryResponseDto],
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            InvalidPage: {
              summary: 'Page must be a positive integer',
              value: { errors: [{ message: 'page must be greater than 0' }] },
            },
            InvalidLimit: {
              summary: 'Limit must be a positive integer',
              value: {
                errors: [{ message: 'limit must be greater than 0' }],
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
    }),
  );
}
