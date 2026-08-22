import { Injectable } from '@nestjs/common';
import { SystemAdminRepository } from '../repository/system-admin.repository';
import { SystemAdminResponseDto } from '../dtos/system-admin-response.dto';
import { plainToInstance } from 'class-transformer';
import { QueryFilter } from 'mongoose';
import { SystemAdmin } from '../schema/system-admin.schema';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';

@Injectable()
export class FindOneUsecase {
  constructor(private readonly systemAdminRepository: SystemAdminRepository) {}

  async execute(
    query: QueryFilter<SystemAdmin>,
  ): Promise<SystemAdminResponseDto> {
    const admin = await this.systemAdminRepository.findOne({
      ...query,
      isDeleted: false,
    });

    if (!admin) {
      throw new CustomNotFoundException('error.SYSTEM_ADMIN_NOT_FOUND');
    }

    return plainToInstance(SystemAdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }
}
