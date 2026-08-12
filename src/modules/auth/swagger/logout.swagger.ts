import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const LogoutSwagger = applyDecorators(
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Logout user',
    description:
      'Invalidates all refresh tokens for the authenticated user, effectively logging them out from all devices.',
  }),
  ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logged out successfully',
        },
      },
    },
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token',
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
                  message: { type: 'string' },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          NoToken: {
            summary: 'Authorization header missing',
            value: {
              errors: [{ message: 'No token provided' }],
            },
          },
          InvalidToken: {
            summary: 'Token malformed or expired',
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
);
