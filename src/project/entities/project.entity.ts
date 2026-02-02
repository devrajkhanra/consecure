import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ProjectStatus } from "./project-status.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity('projects')
export class Project {
    @ApiProperty({ description: 'The unique identifier of the project' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the project' })
    @Column({ length: 255 })
    name: string;

    @ApiProperty({ description: 'The unique work order number', uniqueItems: true })
    @Column({ name: 'work_order_number', unique: true, length: 100 })
    workOrderNumber: string;

    @ApiProperty({ description: 'The location of the project' })
    @Column({ name: 'location', length: 255 })
    location: string;

    @ApiProperty({ description: 'The name of the client' })
    @Column({ name: 'client_name', length: 255 })
    clientName: string;

    @ApiProperty({ description: 'The start date of the project' })
    @Column({ type: 'date', name: 'start_date' })
    startDate: Date;

    @ApiProperty({ description: 'The end date of the project', required: false, nullable: true })
    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: Date;

    @ApiProperty({
        description: 'The status of the project',
        enum: ProjectStatus,
        default: ProjectStatus.BACKLOG
    })
    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.BACKLOG
    })
    status: ProjectStatus;

    @ApiProperty({ description: 'The date when the project was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the project was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
