import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppSettingsResponseDto } from '../dtos/app-settings-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function FindAllAppSettingsSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get app settings',
    }),
    ApiResponse({ status: 200, type: AppSettingsResponseDto }),
    ApiResponse({
      status: 404,
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            NotFound: {
              summary: 'App settings not found',
              value: { errors: [{ message: 'App settings not found' }] },
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
