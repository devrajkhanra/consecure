import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) { }

    async create(createJobDto: CreateJobDto): Promise<Job> {
        const job = this.jobRepository.create(createJobDto);
        return await this.jobRepository.save(job);
    }

    async findAll(): Promise<Job[]> {
        return await this.jobRepository.find({ relations: ['site'] });
    }

    async findOne(id: string): Promise<Job> {
        const job = await this.jobRepository.findOne({ where: { id }, relations: ['site'] });
        if (!job) {
            throw new NotFoundException(`Job with ID ${id} not found`);
        }
        return job;
    }

    async findBySite(siteId: string): Promise<Job[]> {
        return await this.jobRepository.find({ where: { siteId }, relations: ['site'] });
    }

    async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
        const job = await this.findOne(id);
        Object.assign(job, updateJobDto);
        return await this.jobRepository.save(job);
    }

    async remove(id: string): Promise<void> {
        const job = await this.findOne(id);
        await this.jobRepository.remove(job);
    }
}
