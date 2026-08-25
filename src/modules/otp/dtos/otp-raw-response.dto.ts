import { ApiProperty } from "@nestjs/swagger";

export class OtpRawResponseDto {
    @ApiProperty({ description: 'OTP code', example: '123456' })
    code!: string;

    @ApiProperty({
        description: 'OTP expiration date',
        example: '2026-08-01T00:05:00.000Z',
    })
    expiresAt!: Date;

    @ApiProperty({
        description: 'Whether the OTP has been verified',
        example: false,
    })
    isVerified!: boolean;
}
