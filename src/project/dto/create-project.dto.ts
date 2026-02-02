import { IsNotEmpty, IsString, IsEnum, IsOptional, IsISO8601 } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectStatus } from "../entities/project-status.enum";

export class CreateProjectDto {
    @ApiProperty({ description: 'The name of the project', example: 'New Office Construction' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The unique work order number', example: 'WO-12345' })
    @IsString()
    @IsNotEmpty()
    workOrderNumber: string;

    @ApiProperty({ description: 'The location of the project', example: '123 Main St, Springfield' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ description: 'The name of the client', example: 'Acme Corp' })
    @IsString()
    @IsNotEmpty()
    clientName: string;

    @ApiProperty({ description: 'The start date of the project', example: '2023-01-01' })
    @IsISO8601()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ description: 'The end date of the project', example: '2023-12-31', required: false, nullable: true })
    @IsISO8601()
    @IsOptional()
    endDate?: string;

    @ApiProperty({
        description: 'The status of the project',
        enum: ProjectStatus,
        example: ProjectStatus.BACKLOG,
        required: false
    })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;
}
