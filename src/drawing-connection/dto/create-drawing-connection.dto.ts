import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ConnectionType } from "../entities/connection-type.enum";

export class CreateDrawingConnectionDto {
    @ApiProperty({ description: 'First drawing ID' })
    @IsUUID()
    @IsNotEmpty()
    drawingOneId: string;

    @ApiProperty({ description: 'Second drawing ID' })
    @IsUUID()
    @IsNotEmpty()
    drawingTwoId: string;

    @ApiProperty({ description: 'Type of connection element', enum: ConnectionType })
    @IsEnum(ConnectionType)
    @IsNotEmpty()
    connectionType: ConnectionType;

    @ApiPropertyOptional({ description: 'Material ID (if type = material)' })
    @IsUUID()
    @IsOptional()
    materialId?: string;

    @ApiPropertyOptional({ description: 'Spool ID (if type = spool)' })
    @IsUUID()
    @IsOptional()
    spoolId?: string;

    @ApiPropertyOptional({ description: 'Joint ID (if type = joint)' })
    @IsUUID()
    @IsOptional()
    jointId?: string;

    @ApiPropertyOptional({ description: 'Connection description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Additional remarks' })
    @IsString()
    @IsOptional()
    remarks?: string;
}
