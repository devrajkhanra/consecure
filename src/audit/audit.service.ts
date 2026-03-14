import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from './entities/audit-log.entity';

export interface CreateAuditLogParams {
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId?: string;
    summary?: string;
    oldData?: Record<string, unknown>;
    newData?: Record<string, unknown>;
    ipAddress?: string;
}

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepository: Repository<AuditLog>,
    ) {}

    async log(params: CreateAuditLogParams): Promise<AuditLog> {
        const entry = this.auditLogRepository.create(params);
        return this.auditLogRepository.save(entry);
    }

    async findByEntity(
        entityType: string,
        entityId: string,
        limit = 50,
    ): Promise<AuditLog[]> {
        return this.auditLogRepository.find({
            where: { entityType, entityId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByUser(userId: string, limit = 50): Promise<AuditLog[]> {
        return this.auditLogRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findRecent(limit = 100): Promise<AuditLog[]> {
        return this.auditLogRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
}
