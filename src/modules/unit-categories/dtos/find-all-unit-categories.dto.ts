import { PaginationDto } from '@common/data-access/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'Apartment' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'fa-building' })
  @IsOptional()
  @IsString()
  icon?: string;
}
