import { Injectable } from '@nestjs/common';
import { UnitCategoryRepository } from '../repository/unit-category.repository';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SoftDeleteUnitCategoryUsecase {
  constructor(
    private readonly unitCategoryRepository: UnitCategoryRepository,
  ) {}

  async execute(unitCategoryId: string): Promise<UnitCategoryResponseDto> {
    const unitCategory = await this.unitCategoryRepository.findByIdAndUpdate(
      unitCategoryId,
      {
        $set: { isDeleted: true, deletedAt: new Date() },
      },
    );

    if (!unitCategory) {
      throw new CustomNotFoundException('error.UNIT_CATEGORY_NOT_FOUND');
    }

    return plainToInstance(UnitCategoryResponseDto, unitCategory, {
      excludeExtraneousValues: true,
    });
  }
}
