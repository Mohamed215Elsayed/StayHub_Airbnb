import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpsertAppSettingsDto } from '../dtos/upsert-app-settings.dto';
import { AppSettingsResponseDto } from '../dtos/app-settings-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function UpsertAppSettingsSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upsert app settings by ID',
    }),
    ApiParam({ name: 'id', type: String }),
    ApiBody({ type: UpsertAppSettingsDto }),
    ApiResponse({ status: 200, type: AppSettingsResponseDto }),
    ApiResponse({ status: 201, type: AppSettingsResponseDto }),
    ApiResponse({
      status: 400,
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            VatRateInvalid: {
              summary: 'VAT rate must be between 0 and 25',
              value: {
                errors: [{ message: 'vatRate must be between 0 and 25' }],
              },
            },
            MinPriceInvalid: {
              summary: 'Minimum price must be greater than or equal to 0',
              value: {
                errors: [
                  { message: 'minPrice must be greater than or equal to 0' },
                ],
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
  );
}
