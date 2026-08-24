import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@common/constants';

export class PrincipalUserDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User unique identifier (MongoDB ObjectId)',
  })
  _id!: string;

  @ApiProperty({ example: 'Ahmed Hassan', description: 'Full name' })
  name!: string;

  @ApiProperty({ example: 'ahmed@example.com', description: 'Email address' })
  email!: string;
}

export class MeResponseDto {
  @ApiProperty({
    type: () => PrincipalUserDto,
    description: 'Authenticated user data',
  })
  user!: PrincipalUserDto;

  @ApiProperty({
    enum: Roles,
    example: Roles.USER,
    description: 'Authenticated user role',
  })
  role!: Roles;
}
