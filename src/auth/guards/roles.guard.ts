import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../user/entities/role.enum';

const ROLE_HIERARCHY: Record<Role, number> = {
    [Role.SUPER_ADMIN]: 5,
    [Role.ADMIN]: 4,
    [Role.PROJECT_MANAGER]: 3,
    [Role.ENGINEER]: 2,
    [Role.VIEWER]: 1,
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new ForbiddenException('Access denied');
        }

        // SUPER_ADMIN always has access
        if (user.role === Role.SUPER_ADMIN) {
            return true;
        }

        const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
        const minRequiredLevel = Math.min(
            ...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 0),
        );

        if (userLevel < minRequiredLevel) {
            throw new ForbiddenException('Insufficient role permissions');
        }

        return true;
    }
}
