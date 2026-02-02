import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateJobDto {
    @ApiProperty({ description: 'The name of the job', example: 'Electrical Installation' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The description of the job', example: 'Install electrical wiring', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'The site ID this job belongs to' })
    @IsUUID()
    @IsNotEmpty()
    siteId: string;
}
