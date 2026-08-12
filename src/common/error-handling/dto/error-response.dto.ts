import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 'email',
    description: 'The field that caused the validation error',
  })
  field?: string;

  @ApiProperty({
    example: 'Email is required.',
    description: 'Translated error message',
  })
  message!: string | string[];
}

export class ErrorListResponseDto {
  @ApiProperty({
    type: [ErrorResponseDto],
    description: 'List of validation or business errors',
  })
  errors!: ErrorResponseDto[];
}
