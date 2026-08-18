import { Injectable } from "@nestjs/common";
import { CityRepository } from "../repository/city.repository";
import { CityResponseDto } from "../dtos/city-response.dto";
import { CustomNotFoundException } from "@common/error-handling/custom-exceptions/not-found.exception";
import { plainToInstance } from "class-transformer";


@Injectable()
export class FindCityByIdUsecase {
    constructor(private readonly cityRepository: CityRepository) { }
    async execute(cityId: string): Promise<CityResponseDto> {
        const city = await this.cityRepository.findOne({
            _id: cityId,
            isDeleted: false,
        });
        if (!city) throw new CustomNotFoundException('error.CITY_NOT_FOUND');
        return plainToInstance(CityResponseDto, city, {
            excludeExtraneousValues: true,
        });

    }
}

