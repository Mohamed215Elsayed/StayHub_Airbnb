import { Injectable } from '@nestjs/common';
import { UnitCategoryRepository } from '../repository/unit-category.repository';
import { CreateUnitCategoryDto } from '../dtos/create-unit-category.dto';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateUnitCategoryUsecase {
  constructor(private readonly unitCategoryRepository: UnitCategoryRepository) {}

  async execute(body: CreateUnitCategoryDto): Promise<UnitCategoryResponseDto> {
    const existingUnitCategory = await this.unitCategoryRepository.findOne({
      name: body.name,
      isDeleted: false,
    });

    if (existingUnitCategory) {
      throw new CustomConflictException('error.UNIT_CATEGORY_ALREADY_EXISTS');
    }

    const createdUnitCategory = await this.unitCategoryRepository.create(body);

    return plainToInstance(UnitCategoryResponseDto, createdUnitCategory.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
