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
import { RefreshTokenSchema } from './schema/refresh-token.schema';
import { RegisterUsecase } from './use-cases/register.usecase';
import { GenerateTokensAndSaveUsecase } from './use-cases/generateTokensAndSave.usecase';
import { LoginUsecase } from './use-cases/login.usecase';
import { RefreshTokenUsecase } from './use-cases/refresh-token.usecase';
import { LogoutUsecase } from './use-cases/logout.usecase';
import { CoreModule } from '../../core.module';
import { ModelNames } from '@common/data-access';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { LoginAsUserUsecase } from './use-cases/login-as-user.usecase';
import { LoginAsSystemAdminUsecase } from './use-cases/login-as-system-admin.usecase';
import { SystemAdminsModule } from '@modules/system-admins/system-admins.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtAuthGuard,
    ResponseInterceptor,
    RegisterUsecase,
    GenerateTokensAndSaveUsecase,
    LoginUsecase,
    RefreshTokenUsecase,
    LogoutUsecase,
    RefreshTokenRepository,
    LoginAsUserUsecase,
    LoginAsSystemAdminUsecase,
  ],
  exports: [JwtModule],
  imports: [
    CoreModule,
    UsersModule,
    SystemAdminsModule,
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
      { name: ModelNames.REFRESH_TOKENS, schema: RefreshTokenSchema },
    ]),
  ],
})
export class AuthModule {}
