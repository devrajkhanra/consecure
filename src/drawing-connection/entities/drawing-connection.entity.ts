import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Drawing } from "../../job/entities/drawing.entity";
import { Material } from "../../material/entities/material.entity";
import { Spool } from "../../spool/entities/spool.entity";
import { Joint } from "../../joint/entities/joint.entity";
import { ConnectionType } from "./connection-type.enum";

@Entity('drawing_connections')
export class DrawingConnection {
    @ApiProperty({ description: 'The unique identifier of the connection' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'First drawing in the connection', type: () => Drawing })
    @ManyToOne(() => Drawing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'drawing_one_id' })
    drawingOne: Drawing;

    @ApiProperty({ description: 'First drawing ID' })
    @Column({ name: 'drawing_one_id' })
    drawingOneId: string;

    @ApiProperty({ description: 'Second drawing in the connection', type: () => Drawing })
    @ManyToOne(() => Drawing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'drawing_two_id' })
    drawingTwo: Drawing;

    @ApiProperty({ description: 'Second drawing ID' })
    @Column({ name: 'drawing_two_id' })
    drawingTwoId: string;

    @ApiProperty({ description: 'Type of connection element', enum: ConnectionType })
    @Column({ name: 'connection_type', type: 'enum', enum: ConnectionType })
    connectionType: ConnectionType;

    // Optional link to Material
    @ApiProperty({ description: 'Linked material (if connection_type = material)', type: () => Material, required: false })
    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @ApiProperty({ description: 'Material ID', required: false })
    @Column({ name: 'material_id', type: 'uuid', nullable: true })
    materialId: string;

    // Optional link to Spool
    @ApiProperty({ description: 'Linked spool (if connection_type = spool)', type: () => Spool, required: false })
    @ManyToOne(() => Spool, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'spool_id' })
    spool: Spool;

    @ApiProperty({ description: 'Spool ID', required: false })
    @Column({ name: 'spool_id', type: 'uuid', nullable: true })
    spoolId: string;

    // Optional link to Joint
    @ApiProperty({ description: 'Linked joint (if connection_type = joint)', type: () => Joint, required: false })
    @ManyToOne(() => Joint, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'joint_id' })
    joint: Joint;

    @ApiProperty({ description: 'Joint ID', required: false })
    @Column({ name: 'joint_id', type: 'uuid', nullable: true })
    jointId: string;

    @ApiProperty({ description: 'Description of the connection', required: false })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({ description: 'Additional remarks', required: false })
    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ApiProperty({ description: 'The date when the connection was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the connection was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
