import { IsNotEmpty, IsObject, IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaterialStatus } from "../entities/material-status.enum";

export class CreateMaterialDto {
    @ApiProperty({
        description: 'Dynamic data for the material based on defined columns',
        example: { name: 'Steel Pipe', spec: 'A106 Gr.B' }
    })
    @IsObject()
    @IsNotEmpty()
    data: Record<string, any>;

    @ApiProperty({ description: 'Material status', enum: MaterialStatus, required: false, default: MaterialStatus.REQUIRED })
    @IsEnum(MaterialStatus)
    @IsOptional()
    status?: MaterialStatus;

    @ApiProperty({ description: 'Quantity required', example: 100, required: false })
    @IsNumber()
    @IsOptional()
    quantityRequired?: number;

    @ApiProperty({ description: 'Quantity issued', example: 80, required: false })
    @IsNumber()
    @IsOptional()
    quantityIssued?: number;

    @ApiProperty({ description: 'Quantity used', example: 70, required: false })
    @IsNumber()
    @IsOptional()
    quantityUsed?: number;

    @ApiProperty({ description: 'Unit of measurement', example: 'meters', required: false })
    @IsString()
    @IsOptional()
    unit?: string;

    @ApiProperty({ description: 'Additional remarks or notes', required: false })
    @IsString()
    @IsOptional()
    remarks?: string;
}
