import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@common/constants';

@Exclude()
export class UserResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User unique identifier (MongoDB ObjectId)',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }: any) => obj._id?.toString() ?? null)
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Ahmed Hassan', description: 'Full name' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 'ahmed@example.com', description: 'Email address' })
  @Expose()
  email!: string;

  @ApiProperty({ example: '+201012345678', description: 'Phone number' })
  @Expose()
  phoneNumber!: string;

  @ApiProperty({
    example: '2026-08-11T10:30:00.000Z',
    description: 'Account creation timestamp',
  })
  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-08-11T10:35:00.000Z',
    description: 'Last update timestamp',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  @Expose()
  updatedAt!: Date;

  @Exclude()
  password?: string;

  @Exclude()
  __v?: number;

  @ApiProperty({
    enum: Roles,
    example: Roles.USER,
    description: 'User role for authorization',
  })
  @Expose()
  role?: Roles;
}
