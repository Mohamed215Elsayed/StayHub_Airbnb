import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyForgetPasswordOtpDto } from '../dtos/verify-forget-password-otp.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function VerifyForgetPasswordOtpSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify a forget-password OTP code',
      description: 'Validate the OTP code previously sent for password reset.',
    }),
    ApiResponse({
      status: 204,
      description: 'Forget-password OTP verified successfully',
    }),
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
      status: 404,
      description: 'Not Found - no OTP found for this email',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - rate limit exceeded',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: ErrorListResponseDto,
    }),
    ApiBody({ type: VerifyForgetPasswordOtpDto }),
  );
}
