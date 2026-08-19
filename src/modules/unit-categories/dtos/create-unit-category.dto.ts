import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUnitCategoryDto {
  @ApiProperty({ example: 'Apartment' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'fa-building' })
  @IsOptional()
  @IsString()
  icon?: string;
}
