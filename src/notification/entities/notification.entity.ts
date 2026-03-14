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

export enum NotificationType {
    DATA_CREATED = 'DATA_CREATED',
    DATA_UPDATED = 'DATA_UPDATED',
    DATA_DELETED = 'DATA_DELETED',
    STAGE_CHANGED = 'STAGE_CHANGED',
    MEMBER_ADDED = 'MEMBER_ADDED',
    MEMBER_REMOVED = 'MEMBER_REMOVED',
    SYSTEM = 'SYSTEM',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['createdAt'])
export class Notification {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ enum: NotificationType })
    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @ApiProperty()
    @Column({ length: 255 })
    title: string;

    @ApiProperty()
    @Column({ type: 'text' })
    message: string;

    @ApiProperty({ description: 'Entity type this notification references' })
    @Column({ name: 'entity_type', length: 100, nullable: true })
    entityType: string;

    @ApiProperty({ description: 'Entity ID this notification references' })
    @Column({ name: 'entity_id', length: 255, nullable: true })
    entityId: string;

    @ApiProperty()
    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
