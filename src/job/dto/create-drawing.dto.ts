import { IsNotEmpty, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDrawingDto {
    @ApiProperty({ description: 'Dynamic data as key-value pairs', example: { drawingNumber: 'DWG-001', revision: 'A' } })
    @IsObject()
    @IsNotEmpty()
    data: Record<string, any>;
}
