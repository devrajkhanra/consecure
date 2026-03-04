import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Site } from './entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
    private readonly CACHE_PREFIX = 'site';

    constructor(
        @InjectRepository(Site)
        private readonly siteRepository: Repository<Site>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    async create(createSiteDto: CreateSiteDto): Promise<Site> {
        const site = this.siteRepository.create(createSiteDto);
        const saved = await this.siteRepository.save(site);
        await this.invalidateCache();
        return saved;
    }

    async findAll(): Promise<Site[]> {
        const cacheKey = `${this.CACHE_PREFIX}:all`;
        const cached = await this.cacheManager.get<Site[]>(cacheKey);
        if (cached) return cached;

        const sites = await this.siteRepository.find({ relations: ['project'] });
        await this.cacheManager.set(cacheKey, sites);
        return sites;
    }

    async findOne(id: string): Promise<Site> {
        const cacheKey = `${this.CACHE_PREFIX}:${id}`;
        const cached = await this.cacheManager.get<Site>(cacheKey);
        if (cached) return cached;

        const site = await this.siteRepository.findOne({ where: { id }, relations: ['project'] });
        if (!site) {
            throw new NotFoundException(`Site with ID ${id} not found`);
        }
        await this.cacheManager.set(cacheKey, site);
        return site;
    }

    async findByProject(projectId: string): Promise<Site[]> {
        const cacheKey = `${this.CACHE_PREFIX}:project:${projectId}`;
        const cached = await this.cacheManager.get<Site[]>(cacheKey);
        if (cached) return cached;

        const sites = await this.siteRepository.find({ where: { projectId }, relations: ['project'] });
        await this.cacheManager.set(cacheKey, sites);
        return sites;
    }

    async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
        const site = await this.findOne(id);
        Object.assign(site, updateSiteDto);
        const saved = await this.siteRepository.save(site);
        await this.invalidateCache(id, site.projectId);
        return saved;
    }

    async remove(id: string): Promise<void> {
        const site = await this.findOne(id);
        await this.siteRepository.remove(site);
        await this.invalidateCache(id, site.projectId);
    }

    private async invalidateCache(id?: string, projectId?: string): Promise<void> {
        await this.cacheManager.del(`${this.CACHE_PREFIX}:all`);
        if (id) {
            await this.cacheManager.del(`${this.CACHE_PREFIX}:${id}`);
        }
        if (projectId) {
            await this.cacheManager.del(`${this.CACHE_PREFIX}:project:${projectId}`);
        }
    }
}
