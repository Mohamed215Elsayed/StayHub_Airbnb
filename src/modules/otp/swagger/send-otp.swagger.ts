import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOtpDto } from '../dtos/send-otp.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function SendOtpSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send an OTP code',
      description:
        'Generate a one-time password and email it to the provided address.',
    }),
    ApiResponse({ status: 204, description: 'OTP sent successfully' }),
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
    ApiBody({ type: SendOtpDto }),
  );
}
