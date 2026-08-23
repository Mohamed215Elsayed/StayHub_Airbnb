import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { IPrincipal } from '../interfaces/auth.interface';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Observable } from 'rxjs';
import { Roles } from '@common/constants';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { requestWithUser } from './jwt-auth.guard';
import { CustomForbiddenException } from '@common/error-handling/custom-exceptions/forbidden.exception';
import { CustomI18nService } from '@i18n/custom-i18n.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly customI18nService: CustomI18nService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const roles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles) return true;

        const request = context.switchToHttp().getRequest<requestWithUser>();
        const principal = request.principal;
        const userRole = principal.role;

        const canAccess = roles.includes(userRole);

        if (!canAccess)
            throw new CustomForbiddenException(
                this.customI18nService.translate('error.FORBIDDEN'),
            );
        return true;
    }
}