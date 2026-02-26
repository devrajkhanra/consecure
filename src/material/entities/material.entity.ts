import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Drawing } from "../../job/entities/drawing.entity";
import { MaterialStatus } from "./material-status.enum";

@Entity('materials')
export class Material {
    @ApiProperty({ description: 'The unique identifier of the material' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Dynamic data stored as JSON', example: { name: 'Steel Pipe', spec: 'A106 Gr.B' } })
    @Column({ type: 'jsonb', default: {} })
    data: Record<string, any>;

    @ApiProperty({ description: 'Material lifecycle status', enum: MaterialStatus, default: MaterialStatus.REQUIRED })
    @Column({ type: 'enum', enum: MaterialStatus, default: MaterialStatus.REQUIRED })
    status: MaterialStatus;

    @ApiProperty({ description: 'Quantity required', example: 100, default: 0 })
    @Column({ name: 'quantity_required', type: 'decimal', precision: 12, scale: 3, default: 0 })
    quantityRequired: number;

    @ApiProperty({ description: 'Quantity issued/dispatched', example: 80, default: 0 })
    @Column({ name: 'quantity_issued', type: 'decimal', precision: 12, scale: 3, default: 0 })
    quantityIssued: number;

    @ApiProperty({ description: 'Quantity used/consumed', example: 70, default: 0 })
    @Column({ name: 'quantity_used', type: 'decimal', precision: 12, scale: 3, default: 0 })
    quantityUsed: number;

    @ApiProperty({ description: 'Unit of measurement', example: 'meters', required: false })
    @Column({ length: 50, nullable: true })
    unit: string;

    @ApiProperty({ description: 'Additional remarks or notes', required: false })
    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ApiProperty({ description: 'The drawing this material belongs to', type: () => Drawing })
    @ManyToOne(() => Drawing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'drawing_id' })
    drawing: Drawing;

    @ApiProperty({ description: 'The drawing ID' })
    @Column({ name: 'drawing_id' })
    drawingId: string;

    @ApiProperty({ description: 'The date when the material was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the material was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
