import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSiteDto {
    @ApiProperty({ description: 'The name of the site', example: 'Main Building' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The address of the site', example: '456 Oak Ave, Springfield' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: 'The project ID this site belongs to', example: 'uuid-here' })
    @IsUUID()
    @IsNotEmpty()
    projectId: string;
}
