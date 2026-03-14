import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class AddProjectMemberDto {
    @ApiProperty()
    @IsUUID()
    userId: string;

    @ApiProperty({ enum: Role })
    @IsEnum(Role)
    role: Role;
}
