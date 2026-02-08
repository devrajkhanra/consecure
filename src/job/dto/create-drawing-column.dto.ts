import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsInt, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ColumnType } from "../entities/column-type.enum";

export class CreateDrawingColumnDto {
    @ApiProperty({ description: 'The name of the column', example: 'Drawing Number' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The data type of the column', enum: ColumnType, example: ColumnType.TEXT })
    @IsEnum(ColumnType)
    @IsOptional()
    type?: ColumnType;

    @ApiProperty({ description: 'Whether this column is required', example: false, required: false })
    @IsBoolean()
    @IsOptional()
    required?: boolean;

    @ApiProperty({ description: 'The display order of the column', example: 0, required: false })
    @IsInt()
    @IsOptional()
    order?: number;

    @ApiProperty({
        description: 'Mark this column as the revision tracking column. Only changes to this column will trigger change history logging.',
        example: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isRevisionColumn?: boolean;
}

