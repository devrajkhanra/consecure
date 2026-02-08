import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Drawing } from "./drawing.entity";

@Entity('materials')
export class Material {
    @ApiProperty({ description: 'The unique identifier of the material' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Dynamic data stored as JSON', example: { name: 'Steel Pipe', quantity: 10 } })
    @Column({ type: 'jsonb', default: {} })
    data: Record<string, any>;

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
