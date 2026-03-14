import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/entities/role.enum';

export class AuthUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ enum: Role })
    role: Role;
}

export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty({ type: AuthUserDto })
    user: AuthUserDto;
}
