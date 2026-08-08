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
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { RegisterUseCase } from './use-cases/register.usecase';
import { GenerateTokensAndSaveUseCase } from './use-cases/generateTokensAndSave.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { RefreshTokenUseCase } from './use-cases/refresh-token.usecase';
import { LogoutUseCase } from './use-cases/logout.usecase';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtAuthGuard,
    ResponseInterceptor,
    RegisterUseCase,
    GenerateTokensAndSaveUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
  ],
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
              '7d',
            ),
          },
        }) as JwtModuleOptions,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
})
export class AuthModule {}
