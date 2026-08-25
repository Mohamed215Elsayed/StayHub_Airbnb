import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function ResetPasswordSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset user password',
      description:
        'Reset the user password using a verified forget-password OTP code.',
    }),
    ApiResponse({ status: 204, description: 'Password reset successfully' }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid or expired OTP',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: ErrorListResponseDto,
    }),
    ApiBody({ type: ResetPasswordDto }),
  );
}
