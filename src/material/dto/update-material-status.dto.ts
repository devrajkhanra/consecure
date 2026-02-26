import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaterialStatus } from "../entities/material-status.enum";

export class UpdateMaterialStatusDto {
    @ApiProperty({ description: 'The new status for the material', enum: MaterialStatus })
    @IsEnum(MaterialStatus)
    status: MaterialStatus;
}
