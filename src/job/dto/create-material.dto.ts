import { IsNotEmpty, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMaterialDto {
    @ApiProperty({
        description: 'Dynamic data for the material based on defined columns',
        example: { name: 'Steel Pipe', quantity: 10, unit: 'meters' }
    })
    @IsObject()
    @IsNotEmpty()
    data: Record<string, any>;
}
