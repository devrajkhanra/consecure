import { IsEnum, IsOptional, IsString, IsUUID, IsArray, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ChangeType } from "../entities/change-type.enum";

export class CreateDrawingChangeHistoryDto {
    @ApiProperty({ description: 'The type of change', enum: ChangeType })
    @IsEnum(ChangeType)
    changeType: ChangeType;

    @ApiProperty({ description: 'The data before the change', required: false })
    @IsObject()
    @IsOptional()
    previousData?: Record<string, any>;

    @ApiProperty({ description: 'The data after the change', required: false })
    @IsObject()
    @IsOptional()
    newData?: Record<string, any>;

    @ApiProperty({ description: 'Related drawing IDs for merge/split operations', required: false })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    relatedDrawingIds?: string[];

    @ApiProperty({ description: 'Optional reason for the change', required: false })
    @IsString()
    @IsOptional()
    reason?: string;

    @ApiProperty({ description: 'The user who made the change', required: false })
    @IsString()
    @IsOptional()
    changedBy?: string;
}
