import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { IPrincipal, JwtPayload } from '../interfaces/auth.interface';
import { UsersService } from '@modules/users/users.service';
import { SystemAdminsService } from '@modules/system-admins/system-admins.service';
import { Roles } from '@common/constants';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';
import { SystemAdminResponseDto } from '@modules/system-admins/dtos/system-admin-response.dto';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
/**************/
type requestWithUser = Request & {
  principal: IPrincipal;
};
/**************/
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly adminsService: SystemAdminsService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // 1) Extract token from the request header
    const request = context.switchToHttp().getRequest<requestWithUser>();
    const token = this.extractToken(request);
    if (!token) {
      throw new CustomUnauthorizedException('error.NO_TOKEN_PROVIDED');
    }
    // 2) Verify the token
    try {
      // 3) If the token is valid
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      // 4) Build User object
      const currentAccount: IPrincipal = await this.buildCurrentUser(payload);
      // 5) Attach User object to the request
      request.principal = currentAccount;
    } catch (err) {
      this.logger.error(err);
      throw new CustomUnauthorizedException('error.INVALID_OR_EXPIRED_TOKEN');
    }

    return true;
  }
  // ################################
  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [bearer, token] = authHeader.split(' ');
    return (bearer === 'Bearer' && token) ? token : null;
  }
  // ################################
  private async buildCurrentUser(payload: JwtPayload): Promise<IPrincipal> {
    let currentAccount: UserResponseDto | SystemAdminResponseDto;
    if (payload.role === Roles.USER) {
      const user = await this.usersService.findOne({ _id: payload.sub });
      if (!user) {
        throw new CustomUnauthorizedException('error.INVALID_OR_EXPIRED_TOKEN');
      }
      currentAccount = user;
    } else {
      const admin = await this.adminsService.findOne({ _id: payload.sub });
      if (!admin) {
        throw new CustomUnauthorizedException('error.INVALID_OR_EXPIRED_TOKEN');
      }
      currentAccount = admin;
    }

    return {
      user: {
        _id: currentAccount.id,
        name: currentAccount.name,
        email: currentAccount.email,
      },
      role: payload.role,
    };
  }
  // ################################
}

