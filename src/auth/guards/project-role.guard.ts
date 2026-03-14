import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMembership } from '../../user/entities/project-membership.entity';
import { Role } from '../../user/entities/role.enum';

export const PROJECT_ROLES_KEY = 'projectRoles';

const ROLE_HIERARCHY: Record<Role, number> = {
    [Role.SUPER_ADMIN]: 5,
    [Role.ADMIN]: 4,
    [Role.PROJECT_MANAGER]: 3,
    [Role.ENGINEER]: 2,
    [Role.VIEWER]: 1,
};

@Injectable()
export class ProjectRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(ProjectMembership)
        private membershipRepository: Repository<ProjectMembership>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(PROJECT_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Access denied');
        }

        // SUPER_ADMIN and ADMIN always have access
        if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) {
            return true;
        }

        // Extract projectId from route params (could be :projectId or :id on project routes)
        const projectId = request.params.projectId || request.params.id;
        if (!projectId) {
            return true; // No project context, skip check
        }

        const membership = await this.membershipRepository.findOne({
            where: { userId: user.id, projectId },
        });

        if (!membership) {
            throw new ForbiddenException('You are not a member of this project');
        }

        const memberLevel = ROLE_HIERARCHY[membership.role] ?? 0;
        const minRequiredLevel = Math.min(
            ...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 0),
        );

        if (memberLevel < minRequiredLevel) {
            throw new ForbiddenException('Insufficient project role permissions');
        }

        // Attach membership to request for downstream use
        request.projectMembership = membership;
        return true;
    }
}
