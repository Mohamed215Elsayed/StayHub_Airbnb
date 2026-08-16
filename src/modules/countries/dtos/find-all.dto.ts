import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindAllDto {
  @ApiPropertyOptional({
    description: 'Filter by country name',
    example: 'Egypt',
  })
  @IsOptional()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Filter by country code', example: 'EG' })
  @IsOptional()
  @IsString()
  countryCode!: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
