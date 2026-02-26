import { IsNotEmpty, IsEnum, IsNumber, IsString, IsDateString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaterialTransactionType } from "../entities/material-transaction-type.enum";

export class CreateMaterialTransactionDto {
    @ApiProperty({ description: 'Type of transaction', enum: MaterialTransactionType, example: MaterialTransactionType.ISSUED })
    @IsEnum(MaterialTransactionType)
    @IsNotEmpty()
    transactionType: MaterialTransactionType;

    @ApiProperty({ description: 'Quantity for this transaction', example: 50 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'Document/challan/invoice number', example: 'INV-2026-001' })
    @IsString()
    @IsNotEmpty()
    documentNumber: string;

    @ApiProperty({ description: 'Date of the transaction', example: '2026-02-26' })
    @IsDateString()
    @IsNotEmpty()
    transactionDate: string;

    @ApiProperty({ description: 'Additional remarks or notes', required: false })
    @IsString()
    @IsOptional()
    remarks?: string;
}
