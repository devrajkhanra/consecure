import { IsString, MinLength, MaxLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({ enum: Role })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
