import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

export const LoginSwagger = applyDecorators(
  ApiOperation({
    summary: 'Login user and return JWT access token',
    description:
      'Authenticate user with email and password, returns access and refresh tokens',
  }),
  ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: AuthResponseDto, // استخدم type فقط إذا كان AuthResponseDto موثقاً بـ @ApiProperty
  }),
  ApiResponse({
    status: 400,
    description: 'Validation error – one or more fields are invalid or missing',
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
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email is required.' },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          EmailRequired: {
            summary: 'Email field is missing',
            value: {
              errors: [{ field: 'email', message: 'Email is required.' }],
            },
          },
          InvalidEmail: {
            summary: 'Email format is invalid',
            value: {
              errors: [{ field: 'email', message: 'Please enter a valid email address.' }],
            },
          },
          PasswordRequired: {
            summary: 'Password field is missing',
            value: {
              errors: [{ field: 'password', message: 'Password is required.' }],
            },
          },
          PasswordTooLong: {
            summary: 'Password exceeds maximum length',
            value: {
              errors: [{ field: 'password', message: 'Password is too long. Maximum length is 72 characters.' }],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 401,
    description: 'Invalid credentials – email or password is incorrect',
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
                  message: { type: 'string', example: 'Invalid credentials' },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          InvalidCredentials: {
            summary: 'Incorrect email or password',
            value: {
              errors: [{ message: 'Invalid credentials' }],
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
  ApiBody({ type: LoginAuthDto }),
);