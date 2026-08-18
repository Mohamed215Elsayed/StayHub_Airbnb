import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CityResponseDto } from "../dtos/city-response.dto";
import { ErrorListResponseDto } from "@common/error-handling/dto/error-response.dto";

export function FindCityByIdSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get city by ID',
            description: 'Retrieve a single city by its ID',
        }),
        ApiParam({ name: 'id', type: String }),
        ApiResponse({ status: 200, type: CityResponseDto }),
        ApiResponse({
            status: 404,
            description: 'Not Found - City does not exist',
            type: ErrorListResponseDto,
            content: {
                'application/json': {
                    examples: {
                        NotFound: {
                            summary: 'City not found',
                            value: { errors: [{ message: 'City not found' }] },
                        },
                    },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: 'Internal server error',
            type: ErrorListResponseDto,
            content: {
                'application/json': {
                    examples: {
                        InternalError: {
                            summary: 'Internal server error',
                            value: { errors: [{ message: 'Internal server error' }] },
                        },
                    },
                },
            },
        }),
    );
}
