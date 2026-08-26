import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendForgetPasswordOtpDto } from '../dtos/send-forget-password-otp.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function SendForgetPasswordOtpSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send a forget-password OTP code',
      description:
        'Generate a one-time password for password reset and email it to the provided address.',
    }),
    ApiResponse({
      status: 204,
      description: 'Forget-password OTP sent successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - rate limit exceeded',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error - failed to send email',
      type: ErrorListResponseDto,
    }),
    ApiBody({ type: SendForgetPasswordOtpDto }),
  );
}
