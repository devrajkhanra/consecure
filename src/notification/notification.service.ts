import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

export interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
}

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) {}

    async create(params: CreateNotificationParams): Promise<Notification> {
        const notification = this.notificationRepository.create(params);
        return this.notificationRepository.save(notification);
    }

    async notifyProjectMembers(
        userIds: string[],
        params: Omit<CreateNotificationParams, 'userId'>,
    ): Promise<void> {
        const notifications = userIds.map((userId) =>
            this.notificationRepository.create({ ...params, userId }),
        );
        await this.notificationRepository.save(notifications);
    }

    async findByUser(
        userId: string,
        unreadOnly = false,
        limit = 50,
    ): Promise<Notification[]> {
        const where: Record<string, unknown> = { userId };
        if (unreadOnly) {
            where.isRead = false;
        }
        return this.notificationRepository.find({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.notificationRepository.count({
            where: { userId, isRead: false },
        });
    }

    async markAsRead(id: string, userId: string): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({
            where: { id, userId },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        notification.isRead = true;
        return this.notificationRepository.save(notification);
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true },
        );
    }
}
