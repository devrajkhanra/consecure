import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class UpdateProjectMemberDto {
    @ApiProperty({ enum: Role })
    @IsEnum(Role)
    role: Role;
}
