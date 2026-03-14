import { IsNotEmpty, IsString, IsOptional, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateJointDto {
    @ApiProperty({ description: 'Joint number/identifier', example: 'F01' })
    @IsString()
    @IsNotEmpty()
    jointNumber: string;

    @ApiPropertyOptional({ description: 'First material ID for fitup' })
    @IsUUID()
    @IsOptional()
    materialOneId?: string;

    @ApiPropertyOptional({ description: 'Second material ID for fitup' })
    @IsUUID()
    @IsOptional()
    materialTwoId?: string;

    @ApiPropertyOptional({ description: 'Additional remarks' })
    @IsString()
    @IsOptional()
    remarks?: string;
}
