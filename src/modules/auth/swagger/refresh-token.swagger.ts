import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export const RefreshTokenSwagger = applyDecorators(
  ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using a valid refresh token. The old refresh token is rotated (revoked) and a new one is issued.',
  }),
  ApiResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  }),
  ApiResponse({
    status: 400,
    description: 'Validation error – invalid or missing refreshToken field',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'refreshToken' },
                  message: { type: 'string', example: 'Refresh token is required.' },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          TokenRequired: {
            summary: 'Refresh token is missing',
            value: {
              errors: [{ field: 'refreshToken', message: 'Refresh token is required.' }],
            },
          },
          TokenMustBeString: {
            summary: 'Refresh token is not a string',
            value: {
              errors: [{ field: 'refreshToken', message: 'Refresh token must be a valid string.' }],
            },
          },
          TokenTooShort: {
            summary: 'Refresh token is too short (min 10 chars)',
            value: {
              errors: [{ field: 'refreshToken', message: 'Refresh token must be at least 10 characters long.' }],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized – invalid, expired, or revoked refresh token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Invalid refresh token' },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          InvalidToken: {
            summary: 'Malformed or invalid signature',
            value: {
              errors: [{ message: 'Invalid refresh token' }],
            },
          },
          TokenNotFound: {
            summary: 'Token not found or already revoked',
            value: {
              errors: [{ message: 'Invalid refresh token' }],
            },
          },
          InvalidType: {
            summary: 'Token is not a refresh token (missing type claim)',
            value: {
              errors: [{ message: 'Invalid refresh token' }],
            },
          },
          ExpiredToken: {
            summary: 'Refresh token has expired',
            value: {
              errors: [{ message: 'Invalid or expired token' }],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Internal server error' },
            },
            required: ['message'],
          },
        },
      },
      required: ['errors'],
    },
  }),
  ApiBody({ type: RefreshTokenDto }),
);