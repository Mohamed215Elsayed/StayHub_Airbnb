import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SystemAdminResponseDto } from '../dtos/system-admin-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function LoginAsSystemAdminSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login as system admin',
    }),
    ApiResponse({
      status: 200,
      type: SystemAdminResponseDto,
    }),
    ApiResponse({
      status: 401,
      type: ErrorListResponseDto,
      content: {
        'application/json': {
          examples: {
            Unauthorized: {
              summary: 'Unauthorized',
              value: { errors: [{ message: 'Invalid credentials' }] },
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
