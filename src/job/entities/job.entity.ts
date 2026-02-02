import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Site } from "../../site/entities/site.entity";

@Entity('jobs')
export class Job {
    @ApiProperty({ description: 'The unique identifier of the job' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the job' })
    @Column({ length: 255 })
    name: string;

    @ApiProperty({ description: 'The description of the job', required: false })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({ description: 'The site this job belongs to', type: () => Site })
    @ManyToOne(() => Site, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @ApiProperty({ description: 'The site ID' })
    @Column({ name: 'site_id' })
    siteId: string;

    @ApiProperty({ description: 'The date when the job was created' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the job was last updated' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
