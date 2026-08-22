import { Injectable } from '@nestjs/common';
import { UnitCategoryRepository } from '../repository/unit-category.repository';
import { FindAllDto } from '../dtos/find-all-unit-categories.dto';
import { PaginatedResult } from '@common/data-access';
import { UnitCategoryResponseDto } from '../dtos/unit-category-response.dto';
import { QueryFilter } from 'mongoose';
import { UnitCategories } from '../schema/unit-category.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindAllUnitCategoriesUsecase {
  constructor(
    private readonly unitCategoryRepository: UnitCategoryRepository,
  ) {}

  async execute(
    query: FindAllDto,
  ): Promise<PaginatedResult<UnitCategoryResponseDto>> {
    const matchQuery: QueryFilter<UnitCategories> = {
      isDeleted: false,
    };

    if (query?.name) matchQuery.name = { $regex: query.name, $options: 'i' };

    const result = await this.unitCategoryRepository.findPaginated(matchQuery, {
      page: query?.page,
      limit: query?.limit,
      ignoreLimit: query?.ignoreLimit,
      lean: true,
    });

    return new PaginatedResult(
      plainToInstance(UnitCategoryResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      result.totalCount,
      result.page,
      result.limit,
    );
  }
}
