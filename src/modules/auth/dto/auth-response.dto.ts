import { UserResponseDto } from '@modules/users/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  // user!: {
  //   id: string;
  //   name: string;
  //   email: string;
  //   phoneNumber: string;
  //   createdAt: Date;
  //   updatedAt: Date;
  // };
  @ApiProperty({
    type: () => UserResponseDto, // nested object
    description: 'Authenticated user data (excluding sensitive fields)',
  })
  @Expose()
  user!: UserResponseDto;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT access token (short-lived, e.g., 15 minutes)',
  })
  @Expose()
  accessToken!: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT refresh token (long-lived, e.g., 7 days)',
  })
  @Expose()
  refreshToken!: string;
}
