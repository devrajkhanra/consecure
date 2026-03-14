import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from './entities/role.enum';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'List all users (Admin+)' })
    async findAll() {
        return this.userService.findAll();
    }

    @Get('me/projects')
    @ApiOperation({ summary: 'Get current user project memberships' })
    async myProjects(@CurrentUser() user: User) {
        return this.userService.getUserProjects(user.id);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get user by ID (Admin+)' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.findOne(id);
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new user (Admin+)' })
    async create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update user (Admin+)' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Deactivate user (Super Admin only)' })
    async deactivate(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.deactivate(id);
    }

    // Project Membership endpoints
    @Get('projects/:projectId/members')
    @Roles(Role.ENGINEER)
    @ApiOperation({ summary: 'Get project members' })
    async getProjectMembers(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.userService.getProjectMembers(projectId);
    }

    @Post('projects/:projectId/members')
    @Roles(Role.PROJECT_MANAGER)
    @ApiOperation({ summary: 'Add member to project (PM+)' })
    async addProjectMember(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() dto: AddProjectMemberDto,
    ) {
        return this.userService.addProjectMember(projectId, dto);
    }

    @Patch('projects/:projectId/members/:userId')
    @Roles(Role.PROJECT_MANAGER)
    @ApiOperation({ summary: 'Update project member role (PM+)' })
    async updateProjectMemberRole(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body() dto: UpdateProjectMemberDto,
    ) {
        return this.userService.updateProjectMemberRole(projectId, userId, dto);
    }

    @Delete('projects/:projectId/members/:userId')
    @Roles(Role.PROJECT_MANAGER)
    @ApiOperation({ summary: 'Remove member from project (PM+)' })
    async removeProjectMember(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        await this.userService.removeProjectMember(projectId, userId);
        return { message: 'Member removed' };
    }
}
