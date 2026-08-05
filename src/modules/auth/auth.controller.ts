import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { ResponseInterceptor } from './interceptors/auth.interceptor';

@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() registerAuthDto: RegisterAuthDto): Promise<AuthResponse> {
    return this.authService.register(registerAuthDto);
  }
}
