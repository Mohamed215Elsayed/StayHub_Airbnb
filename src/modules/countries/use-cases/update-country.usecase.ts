import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { UpdateCountryDto } from '../dtos/update-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { FindOneCountryUsecase } from './find-one-country.usecase';
import { CountryRepository } from '../repository/country.repository';

@Injectable()
export class UpdateCountryUsecase {
  private readonly logger = new Logger(UpdateCountryUsecase.name);

  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly findOneCountryUsecase: FindOneCountryUsecase,
  ) {}

  async execute(
    id: string,
    body: UpdateCountryDto,
  ): Promise<CountryResponseDto> {
    this.logger.log(`Updating country with id: ${id}`);

    const existing = await this.findOneCountryUsecase.execute({ _id: id });
    if (!existing) {
      throw new CustomConflictException('error.COUNTRY_NOT_FOUND');
    }

    if (body.name) {
      const duplicateByName = await this.findOneCountryUsecase.execute({
        name: body.name,
      });
      if (duplicateByName && duplicateByName.id !== id) {
        this.logger.warn(`Duplicate country name during update: ${body.name}`);
        throw new CustomConflictException(
          'error.COUNTRY_NAME_ALREADY_REGISTERED',
        );
      }
    }

    if (body.countryCode) {
      const duplicateByCode = await this.findOneCountryUsecase.execute({
        countryCode: body.countryCode,
      });
      if (duplicateByCode && duplicateByCode.id !== id) {
        this.logger.warn(
          `Duplicate country code during update: ${body.countryCode}`,
        );
        throw new CustomConflictException(
          'error.COUNTRY_CODE_ALREADY_REGISTERED',
        );
      }
    }

    const updated = await this.countryRepository.findByIdAndUpdate(id, {
      $set: body,
    });

    if (!updated) {
      this.logger.warn(`Country not found for update with id: ${id}`);
      throw new CustomConflictException('error.COUNTRY_NOT_FOUND');
    }

    this.logger.log(
      `Country updated successfully with id: ${updated._id.toString()}`,
    );
    return plainToInstance(CountryResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }
}
