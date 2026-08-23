import { API_TAGS } from '@common/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnitCategoriesService } from './unit-categories.service';
import { CreateUnitCategoryDto } from './dtos/create-unit-category.dto';
import { UnitCategoryResponseDto } from './dtos/unit-category-response.dto';
import {
  CreateUnitCategorySwagger,
  DeleteUnitCategorySwagger,
  FindUnitCategoryByIdSwagger,
} from './swagger';
import { FindAllDto } from './dtos/find-all-unit-categories.dto';
import { PaginatedResult } from '@common/data-access';
import { FindAllUnitCategoriesSwagger } from './swagger/find-all-unit-categories.swagger';
import { UpdateUnitCategorySwagger } from './swagger/update-unit-category.swagger';
import { UpdateUnitCategoryDto } from './dtos/update-unit-category.dto';
import { Authorize } from '@modules/auth/decorators/roles.decorator';
import { Roles } from '@common/constants';

@ApiTags(API_TAGS.UNIT_CATEGORIES)
@Controller('unit-categories')
export class UnitCategoriesController {
  constructor(private readonly unitCategoriesService: UnitCategoriesService) {}

  @CreateUnitCategorySwagger()
  @Post()
  @Authorize(Roles.SYSTEM_ADMIN)
  async createUnitCategory(
    @Body() body: CreateUnitCategoryDto,
  ): Promise<UnitCategoryResponseDto> {
    return this.unitCategoriesService.createUnitCategory(body);
  }

  @FindAllUnitCategoriesSwagger()
  @Get()
  async findAllUnitCategories(
    @Query() query: FindAllDto,
  ): Promise<PaginatedResult<UnitCategoryResponseDto>> {
    return this.unitCategoriesService.findAllUnitCategories(query);
  }

  @UpdateUnitCategorySwagger()
  @Patch('/:id')
  @Authorize(Roles.SYSTEM_ADMIN)
  async updateUnitCategory(
    @Param('id') unitCategoryId: string,
    @Body() body: UpdateUnitCategoryDto,
  ): Promise<UnitCategoryResponseDto> {
    return this.unitCategoriesService.updateUnitCategory(unitCategoryId, body);
  }

  @FindUnitCategoryByIdSwagger()
  @Get('/:id')
  async findUnitCategoryById(
    @Param('id') unitCategoryId: string,
  ): Promise<UnitCategoryResponseDto> {
    return this.unitCategoriesService.findUnitCategoryById(unitCategoryId);
  }

  @DeleteUnitCategorySwagger()
  @Delete('/:id')
  @Authorize(Roles.SYSTEM_ADMIN)
  async deleteUnitCategoryById(
    @Param('id') unitCategoryId: string,
  ): Promise<UnitCategoryResponseDto> {
    return this.unitCategoriesService.deleteUnitCategory(unitCategoryId);
  }
}
