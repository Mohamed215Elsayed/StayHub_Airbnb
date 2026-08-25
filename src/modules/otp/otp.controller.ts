import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Public } from '@modules/auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '@common/swagger';
import { SendOtpDto } from './dtos/send-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { SendOtpSwagger, VerifyOtpSwagger } from './swagger';

@ApiTags(API_TAGS.OTP)
@Controller('otp')
@Public()
export class OtpController {
  constructor(private readonly otpService: OtpService) { }

  // TODO: Add rate limiter
  @SendOtpSwagger()
  @Post('/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendOtp(@Body() body: SendOtpDto): Promise<void> {
    await this.otpService.sendOtp(body.email);
  }

  @VerifyOtpSwagger()
  @Post('/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyOtp(@Body() body: VerifyOtpDto): Promise<void> {
    await this.otpService.verifyOtp(body);
  }
}
