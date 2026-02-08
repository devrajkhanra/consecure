import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrawingChangeHistory } from './entities/drawing-change-history.entity';
import { ChangeType } from './entities/change-type.enum';
import { CreateDrawingChangeHistoryDto } from './dto/create-drawing-change-history.dto';

@Injectable()
export class DrawingChangeHistoryService {
    constructor(
        @InjectRepository(DrawingChangeHistory)
        private readonly changeHistoryRepository: Repository<DrawingChangeHistory>,
    ) { }

    async logChange(
        jobId: string,
        drawingId: string | undefined,
        dto: CreateDrawingChangeHistoryDto,
    ): Promise<DrawingChangeHistory> {
        const entry = this.changeHistoryRepository.create({
            jobId,
            drawingId: drawingId ?? undefined,
            ...dto,
        });
        return await this.changeHistoryRepository.save(entry);
    }

    async findByDrawing(drawingId: string): Promise<DrawingChangeHistory[]> {
        return await this.changeHistoryRepository.find({
            where: { drawingId },
            order: { createdAt: 'DESC' },
        });
    }

    async findByJob(jobId: string, changeType?: ChangeType): Promise<DrawingChangeHistory[]> {
        const queryBuilder = this.changeHistoryRepository
            .createQueryBuilder('history')
            .where('history.job_id = :jobId', { jobId })
            .orderBy('history.created_at', 'DESC');

        if (changeType) {
            queryBuilder.andWhere('history.changeType = :changeType', { changeType });
        }

        return await queryBuilder.getMany();
    }

    async findByRelatedDrawing(drawingId: string): Promise<DrawingChangeHistory[]> {
        return await this.changeHistoryRepository
            .createQueryBuilder('history')
            .where(':drawingId = ANY(history.related_drawing_ids)', { drawingId })
            .orderBy('history.created_at', 'DESC')
            .getMany();
    }
}
