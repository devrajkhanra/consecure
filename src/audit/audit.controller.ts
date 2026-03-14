import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/entities/role.enum';

@ApiTags('Audit Logs')
@Controller('audit-logs')
@ApiBearerAuth()
export class AuditController {
    constructor(private readonly auditService: AuditService) {}

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get recent audit logs (Admin+)' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findRecent(@Query('limit') limit?: number) {
        return this.auditService.findRecent(limit || 100);
    }

    @Get('entity/:entityType/:entityId')
    @ApiOperation({ summary: 'Get audit logs for a specific entity' })
    async findByEntity(
        @Param('entityType') entityType: string,
        @Param('entityId') entityId: string,
        @Query('limit') limit?: number,
    ) {
        return this.auditService.findByEntity(entityType, entityId, limit || 50);
    }

    @Get('user/:userId')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get audit logs for a specific user (Admin+)' })
    async findByUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Query('limit') limit?: number,
    ) {
        return this.auditService.findByUser(userId, limit || 50);
    }
}
