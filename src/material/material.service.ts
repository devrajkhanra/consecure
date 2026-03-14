import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { MaterialStatus } from './entities/material-status.enum';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { SpoolService } from '../spool/spool.service';
import { SpoolStatus } from '../spool/entities/spool-status.enum';

@Injectable()
export class MaterialService {
    constructor(
        @InjectRepository(Material)
        private readonly materialRepository: Repository<Material>,
        private readonly spoolService: SpoolService,
    ) { }

    async create(drawingId: string, createDto: CreateMaterialDto): Promise<Material> {
        const material = this.materialRepository.create({ ...createDto, drawingId });
        const saved = await this.materialRepository.save(material);
        await this.autoGenerateSpools(drawingId, saved.data);
        return saved;
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
        const saved = await this.materialRepository.save(material);
        await this.autoGenerateSpools(material.drawingId, saved.data);
        return saved;
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

    /**
     * Parses the dynamic data payload for 'Spool Number' and 'Spool Qty'.
     * If they exist and match, it automatically creates any missing Spool entities for the drawing.
     */
    private async autoGenerateSpools(drawingId: string, data: Record<string, any> | undefined): Promise<void> {
        if (!data) return;

        const spoolNumbersRaw = data['Spool Number'];
        const spoolQtyRaw = data['Spool Qty'];

        if (!spoolNumbersRaw || !spoolQtyRaw) return;

        const spoolQty = parseInt(spoolQtyRaw, 10);
        if (isNaN(spoolQty) || spoolQty <= 0) return;

        // E.g., "1,7" -> ["1", "7"]
        const numbersStr = String(spoolNumbersRaw);
        const parts = numbersStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (parts.length !== spoolQty) return; // Mismatch between numbers and quantity

        // Formatting logic: "1" -> "S01", "12" -> "S12"
        const generatedSpoolNumbers = parts.map(part => {
            const num = parseInt(part, 10);
            if (!isNaN(num)) {
                return `S${num.toString().padStart(2, '0')}`;
            }
            // Fallback for non-numeric (e.g., "A") -> "SA"
            return `S${part.toUpperCase()}`;
        });

        // Get existing spools for this drawing to avoid duplicates
        const existingSpools = await this.spoolService.findByDrawing(drawingId);
        const existingNumbers = new Set(existingSpools.map(s => s.spoolNumber));

        // Create missing spools
        for (const spoolNumber of generatedSpoolNumbers) {
            if (!existingNumbers.has(spoolNumber)) {
                await this.spoolService.create(drawingId, {
                    spoolNumber,
                    status: SpoolStatus.PENDING,
                    description: `Auto-generated from Material data`,
                });
                // Adding to set in case there are duplicates within the generatedSpoolNumbers array
                existingNumbers.add(spoolNumber); 
            }
        }
    }
}
