import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import { IPrincipal } from '../interfaces/auth.interface';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Observable } from 'rxjs';
import { Roles } from '@common/constants';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { requestWithUser } from './jwt-auth.guard';
import { CustomForbiddenException } from '@common/error-handling/custom-exceptions/forbidden.exception';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly i18nService: I18nService,
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
                this.i18nService.translate('error.FORBIDDEN'),
            );
        return true;
    }
}