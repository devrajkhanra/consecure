import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Joint } from './entities/joint.entity';
import { JointStage } from './entities/joint-stage.enum';
import { Material } from '../material/entities/material.entity';
import { MaterialStatus } from '../material/entities/material-status.enum';
import { CreateJointDto } from './dto/create-joint.dto';
import { UpdateJointDto } from './dto/update-joint.dto';
import { UpdateJointStageDto } from './dto/update-joint-stage.dto';

@Injectable()
export class JointService {
    constructor(
        @InjectRepository(Joint)
        private readonly jointRepository: Repository<Joint>,
        @InjectRepository(Material)
        private readonly materialRepository: Repository<Material>,
    ) { }

    async create(drawingId: string, createDto: CreateJointDto): Promise<Joint> {
        const joint = this.jointRepository.create({ ...createDto, drawingId });
        return await this.jointRepository.save(joint);
    }

    async findByDrawing(drawingId: string): Promise<Joint[]> {
        return await this.jointRepository.find({
            where: { drawingId },
            relations: ['materialOne', 'materialTwo'],
            order: { jointNumber: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Joint> {
        const joint = await this.jointRepository.findOne({
            where: { id },
            relations: ['materialOne', 'materialTwo'],
        });
        if (!joint) {
            throw new NotFoundException(`Joint with ID ${id} not found`);
        }
        return joint;
    }

    async update(id: string, updateDto: UpdateJointDto): Promise<Joint> {
        const joint = await this.findOne(id);
        Object.assign(joint, updateDto);
        return await this.jointRepository.save(joint);
    }

    async updateStage(id: string, stageDto: UpdateJointStageDto): Promise<Joint> {
        const joint = await this.findOne(id);

        joint.stage = stageDto.stage;

        // Set stage dates if provided
        if (stageDto.fitupDate) joint.fitupDate = new Date(stageDto.fitupDate);
        if (stageDto.weldDate) joint.weldDate = new Date(stageDto.weldDate);
        if (stageDto.erectionDate) joint.erectionDate = new Date(stageDto.erectionDate);

        const saved = await this.jointRepository.save(joint);

        // Auto-mark materials as used when stage reaches fitup or beyond
        const activeStages: JointStage[] = [
            JointStage.FITUP,
            JointStage.WELDING,
            JointStage.ERECTION,
            JointStage.COMPLETED,
        ];

        if (activeStages.includes(stageDto.stage)) {
            await this.markMaterialsAsUsed(joint.materialOneId, joint.materialTwoId);
        }

        return saved;
    }

    async remove(id: string): Promise<void> {
        const joint = await this.findOne(id);
        await this.jointRepository.remove(joint);
    }

    /**
     * Automatically mark the two fitup materials as USED
     * if they are not already in the USED status.
     */
    private async markMaterialsAsUsed(materialOneId: string | null, materialTwoId: string | null): Promise<void> {
        const ids = [materialOneId, materialTwoId].filter((id): id is string => !!id);
        if (ids.length === 0) return;

        await this.materialRepository
            .createQueryBuilder()
            .update(Material)
            .set({ status: MaterialStatus.USED })
            .where('id IN (:...ids)', { ids })
            .andWhere('status != :usedStatus', { usedStatus: MaterialStatus.USED })
            .andWhere('out_of_scope = false')
            .execute();
    }
}
