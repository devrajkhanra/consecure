import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'User email address' })
    @Column({ unique: true, length: 255 })
    email: string;

    @Exclude()
    @Column({ name: 'password_hash', length: 255 })
    passwordHash: string;

    @ApiProperty({ description: 'Full name' })
    @Column({ name: 'full_name', length: 255 })
    fullName: string;

    @ApiProperty({ description: 'Global role', enum: Role })
    @Column({ type: 'enum', enum: Role, default: Role.VIEWER })
    role: Role;

    @ApiProperty({ description: 'Whether the user account is active' })
    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
