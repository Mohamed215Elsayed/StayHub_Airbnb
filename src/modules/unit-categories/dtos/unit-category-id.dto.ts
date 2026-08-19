import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UnitCategoryIdDto {
  @ApiProperty({ example: '60d21b4967d0d8992e610c85' })
  @IsNotEmpty()
  @IsMongoId({ message: 'Param must be a valid mongo id' })
  id!: string;
}
