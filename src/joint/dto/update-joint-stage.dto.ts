import { IsNotEmpty, IsEnum, IsOptional, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { JointStage } from "../entities/joint-stage.enum";

export class UpdateJointStageDto {
    @ApiProperty({ description: 'The new stage for the joint', enum: JointStage, example: JointStage.FITUP })
    @IsEnum(JointStage)
    @IsNotEmpty()
    stage: JointStage;

    @ApiPropertyOptional({ description: 'Date fitup was completed', example: '2026-03-13' })
    @IsDateString()
    @IsOptional()
    fitupDate?: string;

    @ApiPropertyOptional({ description: 'Date welding was completed', example: '2026-03-15' })
    @IsDateString()
    @IsOptional()
    weldDate?: string;

    @ApiPropertyOptional({ description: 'Date erection was completed', example: '2026-03-20' })
    @IsDateString()
    @IsOptional()
    erectionDate?: string;
}
