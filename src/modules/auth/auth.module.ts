import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TokenService } from './tokens/token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseInterceptor } from './interceptors/auth.interceptor';
import { EnvironmentVariables } from '@common/configuration/environment.interface';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtAuthGuard, ResponseInterceptor],
  exports: [JwtModule, TokenService, JwtAuthGuard, ResponseInterceptor],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) =>
        ({
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>(
              'ACCESS_TOKEN_EXPIRE_IN',
              '1d',
            ),
          },
        } as JwtModuleOptions),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
