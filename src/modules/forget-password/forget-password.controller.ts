import { API_TAGS } from '@common/swagger';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgetPasswordService } from './forget-password.service';
import {
  ResetPasswordSwagger,
  SendForgetPasswordOtpSwagger,
  VerifyForgetPasswordOtpSwagger,
} from './swagger';
import { SendForgetPasswordOtpDto } from './dtos/send-forget-password-otp.dto';
import { VerifyForgetPasswordOtpDto } from './dtos/verify-forget-password-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@ApiTags(API_TAGS.FORGET_PASSWORD)
@Controller('forget-password')
@Public()
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @SendForgetPasswordOtpSwagger()
  @Post('/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendForgetPasswordOtp(
    @Body() body: SendForgetPasswordOtpDto,
  ): Promise<void> {
    await this.forgetPasswordService.sendForgetPasswordOtp(body.email);
  }

  @VerifyForgetPasswordOtpSwagger()
  @Post('/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyForgetPasswordOtp(
    @Body() dto: VerifyForgetPasswordOtpDto,
  ): Promise<void> {
    await this.forgetPasswordService.verifyForgetPasswordOtp(dto);
  }

  @ResetPasswordSwagger()
  @Post('/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.forgetPasswordService.resetPassword(dto);
  }
}
