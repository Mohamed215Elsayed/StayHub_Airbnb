import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertAppSettingsDto {
  @ApiPropertyOptional({ example: 14, minimum: 0, maximum: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  vatRate?: number;

  @ApiPropertyOptional({ example: 100, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;
}
