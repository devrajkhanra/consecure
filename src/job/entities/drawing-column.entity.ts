import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Job } from "./job.entity";
import { ColumnType } from "./column-type.enum";

@Entity('drawing_columns')
export class DrawingColumn {
    @ApiProperty({ description: 'The unique identifier of the column' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the column' })
    @Column({ length: 255 })
    name: string;

    @ApiProperty({ description: 'The data type of the column', enum: ColumnType })
    @Column({ type: 'enum', enum: ColumnType, default: ColumnType.TEXT })
    type: ColumnType;

    @ApiProperty({ description: 'Whether this column is required', default: false })
    @Column({ default: false })
    required: boolean;

    @ApiProperty({ description: 'The display order of the column', default: 0 })
    @Column({ default: 0 })
    order: number;

    @ApiProperty({
        description: 'Whether this column is the revision tracking column. Only changes to this column trigger change history logging.',
        default: false
    })
    @Column({ name: 'is_revision_column', default: false })
    isRevisionColumn: boolean;

    @ApiProperty({ description: 'The job this column belongs to', type: () => Job })
    @ManyToOne(() => Job, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @ApiProperty({ description: 'The job ID' })
    @Column({ name: 'job_id' })
    jobId: string;
}

