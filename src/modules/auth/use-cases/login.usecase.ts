import { Injectable } from '@nestjs/common';
import { LoginAsUserUsecase } from './login-as-user.usecase';
import { LoginAsSystemAdminUsecase } from './login-as-system-admin.usecase';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Roles } from '@common/constants';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly loginAsUserUsecase: LoginAsUserUsecase,
    private readonly loginAsSystemAdminUsecase: LoginAsSystemAdminUsecase,
  ) {}
  async execute(
    body: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    // login as user
    if (body.role.includes(Roles.USER)) {
      return this.loginAsUserUsecase.execute(body, ipAddress, userAgent);
    }
    // login as system admin
    return this.loginAsSystemAdminUsecase.execute(body, ipAddress, userAgent);
  }
}
