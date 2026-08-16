import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindAllCountriesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all countries',
      description: 'Retrieve a list of all non-deleted countries',
    }),
    ApiResponse({
      status: 200,
      description: 'Countries retrieved successfully',
      type: [CountryResponseDto],
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: ErrorListResponseDto,
    }),
  );
}
