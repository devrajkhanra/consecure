import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Drawing } from "./drawing.entity";
import { Job } from "./job.entity";
import { ChangeType } from "./change-type.enum";

@Entity('drawing_change_history')
export class DrawingChangeHistory {
    @ApiProperty({ description: 'The unique identifier of the change history entry' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The drawing this change is associated with', type: () => Drawing })
    @ManyToOne(() => Drawing, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'drawing_id' })
    drawing: Drawing;

    @ApiProperty({ description: 'The drawing ID (may be null if drawing was deleted)' })
    @Column({ name: 'drawing_id', nullable: true })
    drawingId: string;

    @ApiProperty({ description: 'The job this change belongs to', type: () => Job })
    @ManyToOne(() => Job, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @ApiProperty({ description: 'The job ID' })
    @Column({ name: 'job_id' })
    jobId: string;

    @ApiProperty({ description: 'The type of change', enum: ChangeType })
    @Column({ type: 'enum', enum: ChangeType })
    changeType: ChangeType;

    @ApiProperty({ description: 'The data before the change', nullable: true })
    @Column({ type: 'jsonb', nullable: true })
    previousData: Record<string, any>;

    @ApiProperty({ description: 'The data after the change', nullable: true })
    @Column({ type: 'jsonb', nullable: true })
    newData: Record<string, any>;

    @ApiProperty({ description: 'Related drawing IDs for merge/split operations', nullable: true })
    @Column({ type: 'uuid', array: true, nullable: true, name: 'related_drawing_ids' })
    relatedDrawingIds: string[];

    @ApiProperty({ description: 'Optional reason for the change', nullable: true })
    @Column({ type: 'text', nullable: true })
    reason: string;

    @ApiProperty({ description: 'The user who made the change', nullable: true })
    @Column({ name: 'changed_by', nullable: true })
    changedBy: string;

    @ApiProperty({ description: 'When the change occurred' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
