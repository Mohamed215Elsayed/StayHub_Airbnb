import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { ErrorListResponseDto } from '@common/error-handling/dto/error-response.dto';

export const CreateUserSwagger = applyDecorators(
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Create a new user',
    description:
      'Register a new user account with name, email, password, and phone number. Requires SYSTEM_ADMIN role.',
  }),
  ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: UserResponseDto,
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized - Missing or invalid token',
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
  ApiForbiddenResponse({
    description: 'Forbidden - Insufficient role (requires SYSTEM_ADMIN)',
    type: ErrorListResponseDto,
    content: {
      'application/json': {
        examples: {
          Forbidden: {
            summary: 'User does not have SYSTEM_ADMIN role',
            value: { errors: [{ message: 'Forbidden' }] },
          },
        },
      },
    },
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
          NameRequired: {
            summary: 'Name is missing',
            value: {
              errors: [{ field: 'name', message: 'Name is required.' }],
            },
          },
          InvalidEmail: {
            summary: 'Invalid email format',
            value: {
              errors: [
                {
                  field: 'email',
                  message: 'Please enter a valid email address.',
                },
              ],
            },
          },
          PasswordMinLength: {
            summary: 'Password too short (min 8 chars)',
            value: {
              errors: [
                {
                  field: 'password',
                  message: 'Password must be at least 8 characters long.',
                },
              ],
            },
          },
          InvalidPhone: {
            summary: 'Invalid Egyptian phone number',
            value: {
              errors: [
                {
                  field: 'phoneNumber',
                  message: 'Phone number must be a valid Egyptian number.',
                },
              ],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 409,
    description: 'Conflict – Email or phone number is already registered',
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
                    example: 'Email is already registered',
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
            summary: 'Email already registered',
            value: { errors: [{ message: 'Email is already registered' }] },
          },
          PhoneExists: {
            summary: 'Phone number already registered',
            value: {
              errors: [{ message: 'Phone number is already registered' }],
            },
          },
          UserExists: {
            summary: 'User already exists (generic)',
            value: { errors: [{ message: 'User already exists' }] },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
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
                    example: 'Internal server error',
                  },
                },
                required: ['message'],
              },
            },
          },
          required: ['errors'],
        },
        examples: {
          InternalServerError: {
            summary: 'Unexpected server error',
            value: {
              errors: [
                {
                  message: 'Internal server error',
                },
              ],
            },
          },
        },
      },
    },
  }),
  ApiBody({ type: CreateUserDto }),
);
