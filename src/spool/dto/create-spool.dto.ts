import { IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SpoolStatus } from "../entities/spool-status.enum";

export class CreateSpoolDto {
    @ApiProperty({ description: 'Spool number/identifier', example: 'SP-001' })
    @IsString()
    @IsNotEmpty()
    spoolNumber: string;

    @ApiPropertyOptional({ description: 'Current status of the spool', enum: SpoolStatus, default: SpoolStatus.PENDING })
    @IsEnum(SpoolStatus)
    @IsOptional()
    status?: SpoolStatus;

    @ApiPropertyOptional({ description: 'Spool description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Additional remarks' })
    @IsString()
    @IsOptional()
    remarks?: string;
}
