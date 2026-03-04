import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
    private readonly CACHE_PREFIX = 'job';

    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    async create(createJobDto: CreateJobDto): Promise<Job> {
        const job = this.jobRepository.create(createJobDto);
        const saved = await this.jobRepository.save(job);
        await this.invalidateCache();
        return saved;
    }

    async findAll(): Promise<Job[]> {
        const cacheKey = `${this.CACHE_PREFIX}:all`;
        const cached = await this.cacheManager.get<Job[]>(cacheKey);
        if (cached) return cached;

        const jobs = await this.jobRepository.find({ relations: ['site'] });
        await this.cacheManager.set(cacheKey, jobs);
        return jobs;
    }

    async findOne(id: string): Promise<Job> {
        const cacheKey = `${this.CACHE_PREFIX}:${id}`;
        const cached = await this.cacheManager.get<Job>(cacheKey);
        if (cached) return cached;

        const job = await this.jobRepository.findOne({ where: { id }, relations: ['site'] });
        if (!job) {
            throw new NotFoundException(`Job with ID ${id} not found`);
        }
        await this.cacheManager.set(cacheKey, job);
        return job;
    }

    async findBySite(siteId: string): Promise<Job[]> {
        const cacheKey = `${this.CACHE_PREFIX}:site:${siteId}`;
        const cached = await this.cacheManager.get<Job[]>(cacheKey);
        if (cached) return cached;

        const jobs = await this.jobRepository.find({ where: { siteId }, relations: ['site'] });
        await this.cacheManager.set(cacheKey, jobs);
        return jobs;
    }

    async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
        const job = await this.findOne(id);
        Object.assign(job, updateJobDto);
        const saved = await this.jobRepository.save(job);
        await this.invalidateCache(id, job.siteId);
        return saved;
    }

    async remove(id: string): Promise<void> {
        const job = await this.findOne(id);
        await this.jobRepository.remove(job);
        await this.invalidateCache(id, job.siteId);
    }

    private async invalidateCache(id?: string, siteId?: string): Promise<void> {
        await this.cacheManager.del(`${this.CACHE_PREFIX}:all`);
        if (id) {
            await this.cacheManager.del(`${this.CACHE_PREFIX}:${id}`);
        }
        if (siteId) {
            await this.cacheManager.del(`${this.CACHE_PREFIX}:site:${siteId}`);
        }
    }
}
