import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { ProjectMembership } from './entities/project-membership.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { Role } from './entities/role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ProjectMembership)
        private readonly membershipRepository: Repository<ProjectMembership>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async create(dto: CreateUserDto): Promise<User> {
        const existing = await this.userRepository.findOne({
            where: { email: dto.email.toLowerCase() },
        });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = this.userRepository.create({
            email: dto.email.toLowerCase(),
            passwordHash,
            fullName: dto.fullName,
            role: dto.role ?? Role.VIEWER,
        });

        return this.userRepository.save(user);
    }

    async update(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, dto);
        return this.userRepository.save(user);
    }

    async deactivate(id: string): Promise<User> {
        const user = await this.findOne(id);
        user.isActive = false;
        return this.userRepository.save(user);
    }

    // Project Membership methods
    async getProjectMembers(projectId: string): Promise<ProjectMembership[]> {
        return this.membershipRepository.find({
            where: { projectId },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }

    async addProjectMember(
        projectId: string,
        dto: AddProjectMemberDto,
    ): Promise<ProjectMembership> {
        const existing = await this.membershipRepository.findOne({
            where: { userId: dto.userId, projectId },
        });
        if (existing) {
            throw new ConflictException('User is already a member of this project');
        }

        // Verify user exists
        await this.findOne(dto.userId);

        const membership = this.membershipRepository.create({
            userId: dto.userId,
            projectId,
            role: dto.role,
        });

        return this.membershipRepository.save(membership);
    }

    async updateProjectMemberRole(
        projectId: string,
        userId: string,
        dto: UpdateProjectMemberDto,
    ): Promise<ProjectMembership> {
        const membership = await this.membershipRepository.findOne({
            where: { userId, projectId },
        });
        if (!membership) {
            throw new NotFoundException('Membership not found');
        }

        membership.role = dto.role;
        return this.membershipRepository.save(membership);
    }

    async removeProjectMember(projectId: string, userId: string): Promise<void> {
        const membership = await this.membershipRepository.findOne({
            where: { userId, projectId },
        });
        if (!membership) {
            throw new NotFoundException('Membership not found');
        }
        await this.membershipRepository.remove(membership);
    }

    async getUserProjects(userId: string): Promise<ProjectMembership[]> {
        return this.membershipRepository.find({
            where: { userId },
            relations: ['project'],
            order: { createdAt: 'DESC' },
        });
    }
}
