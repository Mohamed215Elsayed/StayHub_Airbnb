import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendEmailDto } from '../dto/send-email.dto';
import { SendTemplatedEmailDto } from '../dto/send-templated-email.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export function SendEmailSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send a raw email',
      description:
        'Send a plain text or HTML email through the configured SMTP transporter.',
    }),
    ApiResponse({ status: 204, description: 'Email accepted for delivery' }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation errors',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error - SMTP delivery failed',
      type: ErrorListResponseDto,
    }),
    ApiBody({ type: SendEmailDto }),
  );
}

export function SendTemplatedEmailSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send an email from a template',
      description:
        'Render a predefined StayHub template (OTP, welcome, password reset, etc.) with the provided context and send it.',
    }),
    ApiResponse({ status: 204, description: 'Email accepted for delivery' }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation or unknown template',
      type: ErrorListResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error - SMTP delivery failed',
      type: ErrorListResponseDto,
    }),
    ApiBody({ type: SendTemplatedEmailDto }),
  );
}
