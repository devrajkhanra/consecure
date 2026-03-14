import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    STAGE_CHANGE = 'STAGE_CHANGE',
}

@Entity('audit_logs')
@Index(['entityType', 'entityId'])
@Index(['userId'])
@Index(['createdAt'])
export class AuditLog {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ name: 'user_id', nullable: true })
    userId: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ enum: AuditAction })
    @Column({ type: 'enum', enum: AuditAction })
    action: AuditAction;

    @ApiProperty({ description: 'Entity type (e.g., Project, Job, Joint)' })
    @Column({ name: 'entity_type', length: 100 })
    entityType: string;

    @ApiProperty({ description: 'Entity ID' })
    @Column({ name: 'entity_id', length: 255, nullable: true })
    entityId: string;

    @ApiProperty({ description: 'Summary of the change' })
    @Column({ type: 'text', nullable: true })
    summary: string;

    @ApiProperty({ description: 'Previous data (JSON)' })
    @Column({ name: 'old_data', type: 'jsonb', nullable: true })
    oldData: Record<string, unknown>;

    @ApiProperty({ description: 'New data (JSON)' })
    @Column({ name: 'new_data', type: 'jsonb', nullable: true })
    newData: Record<string, unknown>;

    @ApiProperty({ description: 'IP address of the request' })
    @Column({ name: 'ip_address', length: 45, nullable: true })
    ipAddress: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
