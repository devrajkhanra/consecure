import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
    constructor(
        @InjectRepository(Site)
        private readonly siteRepository: Repository<Site>,
    ) { }

    async create(createSiteDto: CreateSiteDto): Promise<Site> {
        const site = this.siteRepository.create(createSiteDto);
        return await this.siteRepository.save(site);
    }

    async findAll(): Promise<Site[]> {
        return await this.siteRepository.find({ relations: ['project'] });
    }

    async findOne(id: string): Promise<Site> {
        const site = await this.siteRepository.findOne({ where: { id }, relations: ['project'] });
        if (!site) {
            throw new NotFoundException(`Site with ID ${id} not found`);
        }
        return site;
    }

    async findByProject(projectId: string): Promise<Site[]> {
        return await this.siteRepository.find({ where: { projectId }, relations: ['project'] });
    }

    async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
        const site = await this.findOne(id);
        Object.assign(site, updateSiteDto);
        return await this.siteRepository.save(site);
    }

    async remove(id: string): Promise<void> {
        const site = await this.findOne(id);
        await this.siteRepository.remove(site);
    }
}
