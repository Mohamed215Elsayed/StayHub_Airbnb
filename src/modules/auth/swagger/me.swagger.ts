import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MeResponseDto } from '../dto/me-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export const MeSwagger = applyDecorators(
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Get current authenticated user',
    description:
      "Returns the currently authenticated user's profile data. Requires a valid Bearer JWT access token.",
  }),
  ApiResponse({
    status: 200,
    description: "The authenticated user's profile.",
    type: MeResponseDto,
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid access token',
    type: ErrorListResponseDto,
    content: {
      'application/json': {
        examples: {
          NoToken: {
            summary: 'Authorization header missing',
            value: { errors: [{ message: 'No token provided' }] },
          },
          InvalidToken: {
            summary: 'Token malformed or expired',
            value: { errors: [{ message: 'Invalid or expired token' }] },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
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
