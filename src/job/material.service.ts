import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
    constructor(
        @InjectRepository(Material)
        private readonly materialRepository: Repository<Material>,
    ) { }

    async create(drawingId: string, createDto: CreateMaterialDto): Promise<Material> {
        const material = this.materialRepository.create({ ...createDto, drawingId });
        return await this.materialRepository.save(material);
    }

    async findByDrawing(drawingId: string): Promise<Material[]> {
        return await this.materialRepository.find({
            where: { drawingId },
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Material> {
        const material = await this.materialRepository.findOne({ where: { id } });
        if (!material) {
            throw new NotFoundException(`Material with ID ${id} not found`);
        }
        return material;
    }

    async update(id: string, updateDto: UpdateMaterialDto): Promise<Material> {
        const material = await this.findOne(id);
        if (updateDto.data) {
            material.data = { ...material.data, ...updateDto.data };
        }
        return await this.materialRepository.save(material);
    }

    async remove(id: string): Promise<void> {
        const material = await this.findOne(id);
        await this.materialRepository.remove(material);
    }

    async findByJob(jobId: string): Promise<Material[]> {
        return await this.materialRepository
            .createQueryBuilder('material')
            .innerJoin('material.drawing', 'drawing')
            .where('drawing.job_id = :jobId', { jobId })
            .andWhere('drawing.is_latest = :isLatest', { isLatest: true })
            .orderBy('material.created_at', 'ASC')
            .getMany();
    }
}
