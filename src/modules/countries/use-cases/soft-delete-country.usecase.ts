import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from '../schema/country.schema';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { plainToInstance } from 'class-transformer';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';

@Injectable()
export class SoftDeleteCountryUsecase {
  private readonly logger = new Logger(SoftDeleteCountryUsecase.name);
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async execute(id: string): Promise<CountryResponseDto> {
    this.logger.log(`Soft deleting country with id: ${id}`);

    const country = await this.countryModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
          },
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!country) {
      this.logger.warn(`Country not found for delete with id: ${id}`);
      throw new CustomNotFoundException('error.COUNTRY_NOT_FOUND');
    }

    this.logger.log(
      `Country soft deleted successfully with id: ${country._id.toString()}`,
    );

    return plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
  }
}
