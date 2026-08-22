import { Injectable } from '@nestjs/common';
import { CreateUnitCategoryDto } from './dtos/create-unit-category.dto';
import { UnitCategoryResponseDto } from './dtos/unit-category-response.dto';
import { CreateUnitCategoryUsecase } from './use-cases/create-unit-category.usecase';
import { FindAllDto } from './dtos/find-all-unit-categories.dto';
import { PaginatedResult } from '@common/data-access';
import { FindAllUnitCategoriesUsecase } from './use-cases/find-all-unit-categories.usecase';
import { UpdateUnitCategoryUsecase } from './use-cases/update-unit-category.usecase';
import { UpdateUnitCategoryDto } from './dtos/update-unit-category.dto';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { FindUnitCategoryByIdUsecase } from './use-cases/find-unit-category-by-id.usecase';
import { SoftDeleteUnitCategoryUsecase } from './use-cases/soft-delete-unit-category.usecase';

@Injectable()
export class UnitCategoriesService {
  constructor(
    private readonly createUnitCategoryUsecase: CreateUnitCategoryUsecase,
    private readonly findAllUnitCategoriesUsecase: FindAllUnitCategoriesUsecase,
    private readonly updateUnitCategoryUsecase: UpdateUnitCategoryUsecase,
    private readonly findOneUsecase: FindOneUsecase,
    private readonly findUnitCategoryByIdUsecase: FindUnitCategoryByIdUsecase,
    private readonly deleteUnitCategoryUsecase: SoftDeleteUnitCategoryUsecase,
  ) {}

  async createUnitCategory(
    body: CreateUnitCategoryDto,
  ): Promise<UnitCategoryResponseDto> {
    return this.createUnitCategoryUsecase.execute(body);
  }

  async findAllUnitCategories(
    query: FindAllDto,
  ): Promise<PaginatedResult<UnitCategoryResponseDto>> {
    return this.findAllUnitCategoriesUsecase.execute(query);
  }

  async updateUnitCategory(
    unitCategoryId: string,
    body: UpdateUnitCategoryDto,
  ): Promise<UnitCategoryResponseDto> {
    return this.updateUnitCategoryUsecase.execute(unitCategoryId, body);
  }

  async findOne(
    query: Record<string, unknown>,
  ): Promise<UnitCategoryResponseDto | null> {
    return this.findOneUsecase.execute(query);
  }

  async findUnitCategoryById(
    unitCategoryId: string,
  ): Promise<UnitCategoryResponseDto> {
    return this.findUnitCategoryByIdUsecase.execute(unitCategoryId);
  }

  async deleteUnitCategory(
    unitCategoryId: string,
  ): Promise<UnitCategoryResponseDto> {
    return this.deleteUnitCategoryUsecase.execute(unitCategoryId);
  }
}
