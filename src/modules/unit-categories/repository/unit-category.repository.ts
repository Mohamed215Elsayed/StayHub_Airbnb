import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { UnitCategories } from '../schema/unit-category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UnitCategoryRepository extends BaseRepository<UnitCategories> {
  constructor(
    @InjectModel(ModelNames.UNIT_CATEGORIES)
    private readonly unitCategoryModel: Model<UnitCategories>,
  ) {
    super(unitCategoryModel);
  }
}
