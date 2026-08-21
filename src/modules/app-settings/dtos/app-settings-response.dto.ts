import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AppSettingsResponseDto {
  @ApiProperty({
    example: '60d21b4967d0d8992e610c85',
  })
  @Transform(({ obj }: any) => obj._id?.toString() ?? null)
  @Expose()
  id!: string;

  @ApiProperty({ example: 14 })
  @Expose()
  vatRate!: number;

  @ApiProperty({ example: 100 })
  @Expose()
  minPrice!: number;

  @ApiProperty({
    example: '2026-01-15T10:30:00.000Z',
  })
  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2026-01-16T12:45:00.000Z',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return value?.toISOString?.() ?? value;
  })
  @Expose()
  updatedAt?: Date;
}
