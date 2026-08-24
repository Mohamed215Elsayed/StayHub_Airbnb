import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export const RegisterSwagger = applyDecorators(
  ApiOperation({
    summary: 'Register a new user',
    description:
      'Register a new user and receive access and refresh tokens. Sets a refresh token as an HttpOnly cookie.',
  }),
  ApiHeader({
    name: 'user-agent',
    description: 'Client user agent string (for security logging)',
    required: false,
  }),
  ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: AuthResponseDto,
  }),
  ApiResponse({
    status: 400,
    description: 'Bad Request - Validation or business logic errors',
    type: ErrorListResponseDto,
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
                  message: {
                    type: 'string',
                  },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          EmailExists: {
            summary: 'Email already exists',
            value: {
              errors: [
                {
                  message: 'Email already exists',
                },
              ],
            },
          },
          PhoneExists: {
            summary: 'Phone number already exists',
            value: {
              errors: [
                {
                  message: 'Phone number already exists',
                },
              ],
            },
          },
          ValidationError: {
            summary: 'Invalid input data',
            value: {
              errors: [
                {
                  message: 'name should not be empty',
                },
              ],
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
              message: {
                type: 'string',
                example: 'Internal server error',
              },
            },
            required: ['message'],
          },
        },
      },
      required: ['errors'],
    },
  }),
  ApiResponse({
    status: 409,
    description: 'Conflict - Email or phone number already exists',
    content: {
      'application/json': {
        examples: {
          EmailExists: {
            summary: 'Email already taken',
            value: { errors: [{ message: 'Email already exists' }] },
          },
          PhoneExists: {
            summary: 'Phone already taken',
            value: { errors: [{ message: 'Phone number already exists' }] },
          },
        },
      },
    },
  }),
  ApiBody({ type: RegisterAuthDto }),
) as any;
