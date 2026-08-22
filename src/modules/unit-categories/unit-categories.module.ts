import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitCategoriesSchema } from './schema/unit-category.schema';
import { ModelNames } from '@common/data-access';
import { UnitCategoriesController } from './unit-categories.controller';
import { UnitCategoriesService } from './unit-categories.service';
import { UnitCategoryRepository } from './repository/unit-category.repository';
import { CreateUnitCategoryUsecase } from './use-cases/create-unit-category.usecase';
import { FindAllUnitCategoriesUsecase } from './use-cases/find-all-unit-categories.usecase';
import { UpdateUnitCategoryUsecase } from './use-cases/update-unit-category.usecase';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { FindUnitCategoryByIdUsecase } from './use-cases/find-unit-category-by-id.usecase';
import { SoftDeleteUnitCategoryUsecase } from './use-cases/soft-delete-unit-category.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.UNIT_CATEGORIES, schema: UnitCategoriesSchema },
    ]),
  ],
  controllers: [UnitCategoriesController],
  providers: [
    UnitCategoriesService,
    UnitCategoryRepository,
    CreateUnitCategoryUsecase,
    FindAllUnitCategoriesUsecase,
    UpdateUnitCategoryUsecase,
    FindOneUsecase,
    FindUnitCategoryByIdUsecase,
    SoftDeleteUnitCategoryUsecase,
  ],
  exports: [],
})
export class UnitCategoriesModule {}
