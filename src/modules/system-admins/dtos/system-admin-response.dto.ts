import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@common/constants';

@Exclude()
export class SystemAdminResponseDto {
  @ApiProperty({
    example: '60d21b4967d0d8992e610c85',
  })
  @Transform(({ obj }: any) => obj._id?.toString() ?? null)
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Admin name', example: 'John Doe' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Admin email', example: 'admin@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ description: 'Is super admin', example: false })
  @Expose()
  isSuperAdmin!: boolean;
  
 @ApiProperty({
    enum: Roles,
    example: Roles.SYSTEM_ADMIN,
    description: 'Admin role for authorization',
  })
  @Expose()
  role!: Roles.SYSTEM_ADMIN;
  @ApiProperty({
    example: '2026-01-15T10:30:00.000Z',
  })
  @Exclude()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  @Expose()
  createdAt?: Date;

  @ApiProperty({
    example: '2026-01-16T12:45:00.000Z',
  })
  @Exclude()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  @Expose()
  updatedAt?: Date;
}
