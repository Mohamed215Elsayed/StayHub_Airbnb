import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CityResponseDto {
  @ApiProperty({
    description: 'City ID',
    example: '60d21b4967d0d8992e610c85',
  })
  @Transform(({ obj }: any) => obj._id?.toString() ?? null)
  @Expose()
  id!: string;

  @ApiProperty({ description: 'City name', example: 'Cairo' })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Country ID',
    example: '60d21b4967d0d8992e610c85',
  })
  @Transform(({ obj }: any) => {
    const raw = obj.country;
    if (!raw) return null;
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object') return raw._id?.toString() ?? null;
    return null;
  })
  @Expose()
  country!: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Egypt',
  })
  @Transform(({ obj }: any) => {
    const raw = obj.country;
    if (!raw) return '';
    if (typeof raw === 'object') return raw.name ?? '';
    return '';
  })
  @Expose()
  countryName?: string;

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
