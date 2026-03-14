import {
    Controller,
    Get,
    Patch,
    Param,
    Query,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    @ApiOperation({ summary: 'Get current user notifications' })
    @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findMine(
        @CurrentUser() user: User,
        @Query('unreadOnly') unreadOnly?: string,
        @Query('limit') limit?: number,
    ) {
        return this.notificationService.findByUser(
            user.id,
            unreadOnly === 'true',
            limit || 50,
        );
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notification count' })
    async getUnreadCount(@CurrentUser() user: User) {
        const count = await this.notificationService.getUnreadCount(user.id);
        return { count };
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    async markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: User,
    ) {
        return this.notificationService.markAsRead(id, user.id);
    }

    @Patch('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    async markAllAsRead(@CurrentUser() user: User) {
        await this.notificationService.markAllAsRead(user.id);
        return { message: 'All notifications marked as read' };
    }
}
