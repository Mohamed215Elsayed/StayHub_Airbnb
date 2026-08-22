import { Injectable } from '@nestjs/common';
import { UnitCategoryRepository } from '../repository/unit-category.repository';
import { UpdateUnitCategoryDto } from '../dtos/update-unit-category.dto';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateUnitCategoryUsecase {
  constructor(
    private readonly unitCategoryRepository: UnitCategoryRepository,
  ) {}

  async execute(
    unitCategoryId: string,
    body: UpdateUnitCategoryDto,
  ): Promise<UnitCategoryResponseDto> {
    const unitCategory = await this.unitCategoryRepository.findOne({
      _id: unitCategoryId,
      isDeleted: false,
    });

    if (!unitCategory) {
      throw new CustomNotFoundException('error.UNIT_CATEGORY_NOT_FOUND');
    }

    if (body?.name) {
      const existingUnitCategory = await this.unitCategoryRepository.findOne({
        name: body.name,
        isDeleted: false,
        _id: { $ne: unitCategoryId },
      });

      if (existingUnitCategory) {
        throw new CustomConflictException('error.UNIT_CATEGORY_ALREADY_EXISTS');
      }
    }

    const updatedUnitCategory =
      await this.unitCategoryRepository.findByIdAndUpdate(unitCategoryId, body);

    if (!updatedUnitCategory) {
      throw new CustomNotFoundException('error.UNIT_CATEGORY_NOT_FOUND');
    }

    return plainToInstance(
      UnitCategoryResponseDto,
      updatedUnitCategory.toObject(),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
