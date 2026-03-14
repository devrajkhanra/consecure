import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongP@ss1' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    fullName: string;

    @ApiPropertyOptional({ enum: Role, default: Role.VIEWER })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
