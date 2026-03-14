import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Drawing } from "../../job/entities/drawing.entity";
import { SpoolStatus } from "./spool-status.enum";

@Entity('spools')
@Unique(['spoolNumber', 'drawingId'])
export class Spool {
    @ApiProperty({ description: 'The unique identifier of the spool' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Spool number/identifier', example: 'SP-001' })
    @Column({ name: 'spool_number', length: 100 })
    spoolNumber: string;

    @ApiProperty({ description: 'The drawing this spool belongs to', type: () => Drawing })
    @ManyToOne(() => Drawing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'drawing_id' })
    drawing: Drawing;

    @ApiProperty({ description: 'The drawing ID' })
    @Column({ name: 'drawing_id' })
    drawingId: string;

    @ApiProperty({ description: 'Current status of the spool', enum: SpoolStatus, default: SpoolStatus.PENDING })
    @Column({ type: 'enum', enum: SpoolStatus, default: SpoolStatus.PENDING })
    status: SpoolStatus;

    @ApiProperty({ description: 'Spool description', required: false })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({ description: 'Additional remarks', required: false })
    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ApiProperty({ description: 'The date when the spool was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the spool was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
