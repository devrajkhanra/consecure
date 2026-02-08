import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Job } from "./job.entity";

@Entity('drawings')
export class Drawing {
    @ApiProperty({ description: 'The unique identifier of the drawing' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Dynamic data stored as JSON', example: { column1: 'value1', column2: 123 } })
    @Column({ type: 'jsonb', default: {} })
    data: Record<string, any>;

    @ApiProperty({ description: 'Revision number (starts at 1)', default: 1 })
    @Column({ default: 1 })
    revision: number;

    @ApiProperty({ description: 'Parent drawing ID (previous revision)', nullable: true })
    @Column({ name: 'parent_id', type: 'uuid', nullable: true })
    parentId: string;

    @ApiProperty({ description: 'Whether this is the latest/active revision', default: true })
    @Column({ name: 'is_latest', default: true })
    isLatest: boolean;

    @ApiProperty({ description: 'The job this drawing belongs to', type: () => Job })
    @ManyToOne(() => Job, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @ApiProperty({ description: 'The job ID' })
    @Column({ name: 'job_id' })
    jobId: string;

    @ApiProperty({ description: 'The date when the drawing was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the drawing was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

