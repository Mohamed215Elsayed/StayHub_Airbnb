import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from '../schema/country.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { UpdateCountryDto } from '../dtos/update-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { FindOneCountryUsecase } from './find-one-country.usecase';

@Injectable()
export class UpdateCountryUsecase {
  private readonly logger = new Logger(UpdateCountryUsecase.name);

  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    private readonly findOneCountryUsecase: FindOneCountryUsecase,
  ) {}

  async execute(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<CountryResponseDto> {
    this.logger.log(`Updating country with id: ${id}`);

    const existing = await this.findOneCountryUsecase.execute({ _id: id });
    if (!existing) {
      throw new CustomConflictException('error.COUNTRY_NOT_FOUND');
    }

    if (updateCountryDto.name) {
      const duplicateByName = await this.findOneCountryUsecase.execute({
        name: updateCountryDto.name,
      });
      if (duplicateByName && duplicateByName.id !== id) {
        this.logger.warn(
          `Duplicate country name during update: ${updateCountryDto.name}`,
        );
        throw new CustomConflictException(
          'error.COUNTRY_NAME_ALREADY_REGISTERED',
        );
      }
    }

    if (updateCountryDto.countryCode) {
      const duplicateByCode = await this.findOneCountryUsecase.execute({
        countryCode: updateCountryDto.countryCode,
      });
      if (duplicateByCode && duplicateByCode.id !== id) {
        this.logger.warn(
          `Duplicate country code during update: ${updateCountryDto.countryCode}`,
        );
        throw new CustomConflictException(
          'error.COUNTRY_CODE_ALREADY_REGISTERED',
        );
      }
    }

    const updated = await this.countryModel
      .findByIdAndUpdate(
        id,
        { $set: updateCountryDto },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();

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
