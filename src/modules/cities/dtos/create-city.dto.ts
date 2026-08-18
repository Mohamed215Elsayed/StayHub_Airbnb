import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'Cairo',
    minLength: 2,
    maxLength: 100,
    required: true,
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Country MongoDB ID',
    example: '60d21b4967d0d8992e610c85',
    required: true,
  })
  @IsDefined()
  @IsMongoId()
  country!: string;
}
