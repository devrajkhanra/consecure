import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  private readonly CACHE_PREFIX = 'project';

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    const saved = await this.projectRepository.save(project);
    await this.invalidateCache();
    return saved;
  }

  async findAll(): Promise<Project[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all`;
    const cached = await this.cacheManager.get<Project[]>(cacheKey);
    if (cached) return cached;

    const projects = await this.projectRepository.find();
    await this.cacheManager.set(cacheKey, projects);
    return projects;
  }

  async findOne(id: string): Promise<Project> {
    const cacheKey = `${this.CACHE_PREFIX}:${id}`;
    const cached = await this.cacheManager.get<Project>(cacheKey);
    if (cached) return cached;

    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, project);
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    const saved = await this.projectRepository.save(project);
    await this.invalidateCache(id);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
    await this.invalidateCache(id);
  }

  private async invalidateCache(id?: string): Promise<void> {
    await this.cacheManager.del(`${this.CACHE_PREFIX}:all`);
    if (id) {
      await this.cacheManager.del(`${this.CACHE_PREFIX}:${id}`);
    }
  }
}
