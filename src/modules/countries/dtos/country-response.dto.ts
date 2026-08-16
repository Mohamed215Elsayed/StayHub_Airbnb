import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CountryResponseDto {
  @ApiProperty({
    description: 'Country ID',
    example: '60d21b4967d0d8992e610c85',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }: any) => obj._id?.toString() ?? null)
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Country name', example: 'Egypt' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'ISO country code', example: 'EG' })
  @Expose()
  countryCode!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-15T10:30:00.000Z',
  })
  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-16T12:45:00.000Z',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  @Expose()
  updatedAt?: Date;
}
