import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Project } from "../../project/entities/project.entity";

@Entity('sites')
export class Site {
    @ApiProperty({ description: 'The unique identifier of the site' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the site' })
    @Column({ length: 255 })
    name: string;

    @ApiProperty({ description: 'The address of the site' })
    @Column({ length: 500 })
    address: string;

    @ApiProperty({ description: 'The project this site belongs to', type: () => Project })
    @ManyToOne(() => Project, (project) => project.sites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ApiProperty({ description: 'The project ID' })
    @Column({ name: 'project_id' })
    projectId: string;

    @ApiProperty({ description: 'The date when the site was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the site was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
