import { Injectable } from '@nestjs/common';
import { UnitCategoryRepository } from '../repository/unit-category.repository';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindOneUsecase {
  constructor(
    private readonly unitCategoryRepository: UnitCategoryRepository,
  ) {}

  async execute(
    query: Record<string, unknown>,
  ): Promise<UnitCategoryResponseDto | null> {
    const unitCategory = await this.unitCategoryRepository.findOne({
      ...query,
      isDeleted: false,
    });

    if (unitCategory) {
      return plainToInstance(UnitCategoryResponseDto, unitCategory, {
        excludeExtraneousValues: true,
      });
    }

    return null;
  }
}
