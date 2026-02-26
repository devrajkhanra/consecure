import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Material } from "../../material/entities/material.entity";
import { MaterialTransactionType } from "./material-transaction-type.enum";

@Entity('material_transactions')
export class MaterialTransaction {
    @ApiProperty({ description: 'The unique identifier of the transaction' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The material this transaction belongs to', type: () => Material })
    @ManyToOne(() => Material, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @ApiProperty({ description: 'The material ID' })
    @Column({ name: 'material_id' })
    materialId: string;

    @ApiProperty({ description: 'Type of transaction', enum: MaterialTransactionType })
    @Column({ name: 'transaction_type', type: 'enum', enum: MaterialTransactionType })
    transactionType: MaterialTransactionType;

    @ApiProperty({ description: 'Quantity for this transaction', example: 50 })
    @Column({ type: 'decimal', precision: 12, scale: 3 })
    quantity: number;

    @ApiProperty({ description: 'Document/challan/invoice number', example: 'INV-2026-001' })
    @Column({ name: 'document_number', length: 255 })
    documentNumber: string;

    @ApiProperty({ description: 'Date of the transaction' })
    @Column({ name: 'transaction_date', type: 'date' })
    transactionDate: Date;

    @ApiProperty({ description: 'Additional remarks or notes', required: false })
    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ApiProperty({ description: 'The date when the transaction was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the transaction was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
