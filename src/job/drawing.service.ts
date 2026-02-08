import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from './entities/drawing.entity';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { DrawingChangeHistoryService } from './drawing-change-history.service';
import { DrawingColumnService } from './drawing-column.service';
import { ChangeType } from './entities/change-type.enum';

@Injectable()
export class DrawingService {
    constructor(
        @InjectRepository(Drawing)
        private readonly drawingRepository: Repository<Drawing>,
        private readonly changeHistoryService: DrawingChangeHistoryService,
        private readonly columnService: DrawingColumnService,
    ) { }

    async create(jobId: string, createDto: CreateDrawingDto): Promise<Drawing> {
        const drawing = this.drawingRepository.create({
            ...createDto,
            jobId,
            revision: 1,
            isLatest: true,
        });
        const savedDrawing = await this.drawingRepository.save(drawing);

        // Check if drawing has revision column value set - if so, log creation
        const revisionColumn = await this.columnService.findRevisionColumn(jobId);
        const hasRevisionValue = revisionColumn && savedDrawing.data[revisionColumn.name] !== undefined;

        if (hasRevisionValue) {
            await this.changeHistoryService.logChange(jobId, savedDrawing.id, {
                changeType: ChangeType.CREATED,
                newData: savedDrawing.data,
            });
        }

        return savedDrawing;
    }

    async findByJob(jobId: string): Promise<Drawing[]> {
        // Return only latest revisions by default
        return await this.drawingRepository.find({
            where: { jobId, isLatest: true },
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Drawing> {
        const drawing = await this.drawingRepository.findOne({ where: { id } });
        if (!drawing) {
            throw new NotFoundException(`Drawing with ID ${id} not found`);
        }
        return drawing;
    }

    async findAllRevisions(drawingId: string): Promise<Drawing[]> {
        const drawing = await this.findOne(drawingId);

        // Find the root drawing by traversing up the parent chain
        let rootId = drawing.id;
        let current = drawing;
        while (current.parentId) {
            rootId = current.parentId;
            current = await this.findOne(current.parentId);
        }

        // Find all revisions in the chain
        const revisions: Drawing[] = [current];
        let children = await this.drawingRepository.find({ where: { parentId: current.id } });
        while (children.length > 0) {
            revisions.push(...children);
            const nextParentIds = children.map(c => c.id);
            children = await this.drawingRepository
                .createQueryBuilder('drawing')
                .where('drawing.parent_id IN (:...ids)', { ids: nextParentIds })
                .getMany();
        }

        return revisions.sort((a, b) => a.revision - b.revision);
    }

    async update(id: string, updateDto: UpdateDrawingDto): Promise<Drawing> {
        const oldDrawing = await this.findOne(id);
        const previousData = { ...oldDrawing.data };

        // Mark old drawing as not latest
        oldDrawing.isLatest = false;
        await this.drawingRepository.save(oldDrawing);

        // Create new revision with merged data
        const newData = updateDto.data
            ? { ...oldDrawing.data, ...updateDto.data }
            : oldDrawing.data;

        const newDrawing = this.drawingRepository.create({
            jobId: oldDrawing.jobId,
            data: newData,
            revision: oldDrawing.revision + 1,
            parentId: oldDrawing.id,
            isLatest: true,
        });
        const savedDrawing = await this.drawingRepository.save(newDrawing);

        // Only log to change history if revision column value changed
        const shouldLogChange = await this.hasRevisionColumnChanged(
            oldDrawing.jobId,
            previousData,
            savedDrawing.data
        );

        if (shouldLogChange) {
            await this.changeHistoryService.logChange(oldDrawing.jobId, savedDrawing.id, {
                changeType: ChangeType.UPDATED,
                previousData,
                newData: savedDrawing.data,
                relatedDrawingIds: [oldDrawing.id],
            });
        }

        return savedDrawing;
    }

    async remove(id: string): Promise<void> {
        const drawing = await this.findOne(id);
        const previousData = { ...drawing.data };
        const jobId = drawing.jobId;

        await this.drawingRepository.remove(drawing);

        // Always log removals
        await this.changeHistoryService.logChange(jobId, undefined, {
            changeType: ChangeType.REMOVED,
            previousData,
            relatedDrawingIds: [id],
        });
    }

    /**
     * Check if the revision column value has changed between old and new data.
     * If no revision column is defined for the job, returns false (no history logging).
     */
    private async hasRevisionColumnChanged(
        jobId: string,
        previousData: Record<string, any>,
        newData: Record<string, any>
    ): Promise<boolean> {
        const revisionColumn = await this.columnService.findRevisionColumn(jobId);

        // If no revision column is defined, don't log changes
        if (!revisionColumn) {
            return false;
        }

        const columnName = revisionColumn.name;
        const oldValue = previousData[columnName];
        const newValue = newData[columnName];

        // Log if: first time setting revision value, or value changed
        return oldValue !== newValue;
    }
}

