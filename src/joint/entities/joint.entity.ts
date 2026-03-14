import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Drawing } from "../../job/entities/drawing.entity";
import { Material } from "../../material/entities/material.entity";
import { JointStage } from "./joint-stage.enum";

@Entity('joints')
@Unique(['jointNumber', 'drawingId'])
export class Joint {
    @ApiProperty({ description: 'The unique identifier of the joint' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Joint number/identifier', example: 'F01' })
    @Column({ name: 'joint_number', length: 50 })
    jointNumber: string;

    @ApiProperty({ description: 'The drawing this joint belongs to', type: () => Drawing })
    @ManyToOne(() => Drawing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'drawing_id' })
    drawing: Drawing;

    @ApiProperty({ description: 'The drawing ID' })
    @Column({ name: 'drawing_id' })
    drawingId: string;

    @ApiProperty({ description: 'Current stage of the joint', enum: JointStage, default: JointStage.PENDING })
    @Column({ type: 'enum', enum: JointStage, default: JointStage.PENDING })
    stage: JointStage;

    @ApiProperty({ description: 'First material used in fitup', type: () => Material, required: false })
    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_one_id' })
    materialOne: Material;

    @ApiProperty({ description: 'First material ID', required: false })
    @Column({ name: 'material_one_id', type: 'uuid', nullable: true })
    materialOneId: string;

    @ApiProperty({ description: 'Second material used in fitup', type: () => Material, required: false })
    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_two_id' })
    materialTwo: Material;

    @ApiProperty({ description: 'Second material ID', required: false })
    @Column({ name: 'material_two_id', type: 'uuid', nullable: true })
    materialTwoId: string;

    @ApiProperty({ description: 'Date fitup was completed', required: false })
    @Column({ name: 'fitup_date', type: 'date', nullable: true })
    fitupDate: Date;

    @ApiProperty({ description: 'Date welding was completed', required: false })
    @Column({ name: 'weld_date', type: 'date', nullable: true })
    weldDate: Date;

    @ApiProperty({ description: 'Date erection was completed', required: false })
    @Column({ name: 'erection_date', type: 'date', nullable: true })
    erectionDate: Date;

    @ApiProperty({ description: 'Additional remarks', required: false })
    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ApiProperty({ description: 'The date when the joint was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the joint was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
