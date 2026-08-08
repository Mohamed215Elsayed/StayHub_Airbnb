import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/auth.interface';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new CustomUnauthorizedException('error.NO_TOKEN_PROVIDED');
    }

    try {
      const payload = this.jwtService.verify(token);
      (request as any).user = payload;
      return true;
    } catch {
      throw new CustomUnauthorizedException('error.INVALID_OR_EXPIRED_TOKEN');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
