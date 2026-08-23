import { Roles } from "@common/constants";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
export const Authorize  = (...roles:Roles[]) => SetMetadata(ROLES_KEY, roles);