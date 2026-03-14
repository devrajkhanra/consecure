import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Project } from '../../project/entities/project.entity';
import { Role } from './role.enum';

@Entity('project_memberships')
@Unique(['userId', 'projectId'])
export class ProjectMembership {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ name: 'user_id' })
    userId: string;

    @ApiProperty()
    @Column({ name: 'project_id' })
    projectId: string;

    @ApiProperty({ description: 'Role within the project', enum: Role })
    @Column({ type: 'enum', enum: Role, default: Role.VIEWER })
    role: Role;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
