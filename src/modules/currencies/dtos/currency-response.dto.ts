import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CurrencyResponseDto {
  @ApiProperty({
    description: 'Currency ID',
    example: '60d21b4967d0d8992e610c85',
  })
  @Transform(({ obj }: any) => obj._id?.toString() ?? null)
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Currency name', example: 'Egyptian Pound' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'ISO currency code', example: 'EGP' })
  @Expose()
  currencyCode!: string;

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
