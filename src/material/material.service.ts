import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { MaterialStatus } from './entities/material-status.enum';
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

    async findByDrawing(drawingId: string, status?: MaterialStatus): Promise<Material[]> {
        const where: any = { drawingId };
        if (status) {
            where.status = status;
        }
        return await this.materialRepository.find({
            where,
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
        const { data, ...rest } = updateDto;
        Object.assign(material, rest);
        return await this.materialRepository.save(material);
    }

    async updateStatus(id: string, status: MaterialStatus): Promise<Material> {
        const material = await this.findOne(id);
        material.status = status;
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

    async getJobMaterialSummary(jobId: string): Promise<{ status: MaterialStatus; count: number; totalRequired: number; totalIssued: number; totalUsed: number }[]> {
        const results = await this.materialRepository
            .createQueryBuilder('material')
            .innerJoin('material.drawing', 'drawing')
            .select('material.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(material.quantity_required), 0)', 'totalRequired')
            .addSelect('COALESCE(SUM(material.quantity_issued), 0)', 'totalIssued')
            .addSelect('COALESCE(SUM(material.quantity_used), 0)', 'totalUsed')
            .where('drawing.job_id = :jobId', { jobId })
            .andWhere('drawing.is_latest = :isLatest', { isLatest: true })
            .groupBy('material.status')
            .getRawMany();

        return results.map(r => ({
            status: r.status,
            count: parseInt(r.count, 10),
            totalRequired: parseFloat(r.totalRequired),
            totalIssued: parseFloat(r.totalIssued),
            totalUsed: parseFloat(r.totalUsed),
        }));
    }
}
