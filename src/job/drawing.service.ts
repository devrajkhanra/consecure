import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from './entities/drawing.entity';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';

@Injectable()
export class DrawingService {
    constructor(
        @InjectRepository(Drawing)
        private readonly drawingRepository: Repository<Drawing>,
    ) { }

    async create(jobId: string, createDto: CreateDrawingDto): Promise<Drawing> {
        const drawing = this.drawingRepository.create({ ...createDto, jobId });
        return await this.drawingRepository.save(drawing);
    }

    async findByJob(jobId: string): Promise<Drawing[]> {
        return await this.drawingRepository.find({ where: { jobId }, order: { createdAt: 'ASC' } });
    }

    async findOne(id: string): Promise<Drawing> {
        const drawing = await this.drawingRepository.findOne({ where: { id } });
        if (!drawing) {
            throw new NotFoundException(`Drawing with ID ${id} not found`);
        }
        return drawing;
    }

    async update(id: string, updateDto: UpdateDrawingDto): Promise<Drawing> {
        const drawing = await this.findOne(id);
        if (updateDto.data) {
            drawing.data = { ...drawing.data, ...updateDto.data };
        }
        return await this.drawingRepository.save(drawing);
    }

    async remove(id: string): Promise<void> {
        const drawing = await this.findOne(id);
        await this.drawingRepository.remove(drawing);
    }
}
