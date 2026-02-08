import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrawingColumn } from './entities/drawing-column.entity';
import { CreateDrawingColumnDto } from './dto/create-drawing-column.dto';
import { UpdateDrawingColumnDto } from './dto/update-drawing-column.dto';

@Injectable()
export class DrawingColumnService {
    constructor(
        @InjectRepository(DrawingColumn)
        private readonly columnRepository: Repository<DrawingColumn>,
    ) { }

    async create(jobId: string, createDto: CreateDrawingColumnDto): Promise<DrawingColumn> {
        // If marking this as revision column, unmark any existing one
        if (createDto.isRevisionColumn) {
            await this.clearRevisionColumn(jobId);
        }
        const column = this.columnRepository.create({ ...createDto, jobId });
        return await this.columnRepository.save(column);
    }

    async findByJob(jobId: string): Promise<DrawingColumn[]> {
        return await this.columnRepository.find({ where: { jobId }, order: { order: 'ASC' } });
    }

    async findOne(id: string): Promise<DrawingColumn> {
        const column = await this.columnRepository.findOne({ where: { id } });
        if (!column) {
            throw new NotFoundException(`Column with ID ${id} not found`);
        }
        return column;
    }

    async findRevisionColumn(jobId: string): Promise<DrawingColumn | null> {
        return await this.columnRepository.findOne({
            where: { jobId, isRevisionColumn: true }
        });
    }

    async update(id: string, updateDto: UpdateDrawingColumnDto): Promise<DrawingColumn> {
        const column = await this.findOne(id);

        // If marking this as revision column, unmark any existing one first
        if (updateDto.isRevisionColumn && !column.isRevisionColumn) {
            await this.clearRevisionColumn(column.jobId);
        }

        Object.assign(column, updateDto);
        return await this.columnRepository.save(column);
    }

    async remove(id: string): Promise<void> {
        const column = await this.findOne(id);
        await this.columnRepository.remove(column);
    }

    private async clearRevisionColumn(jobId: string): Promise<void> {
        const existingRevisionColumn = await this.findRevisionColumn(jobId);
        if (existingRevisionColumn) {
            existingRevisionColumn.isRevisionColumn = false;
            await this.columnRepository.save(existingRevisionColumn);
        }
    }
}

