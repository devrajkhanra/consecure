import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialColumn } from './entities/material-column.entity';
import { CreateMaterialColumnDto } from './dto/create-material-column.dto';
import { UpdateMaterialColumnDto } from './dto/update-material-column.dto';

@Injectable()
export class MaterialColumnService {
    constructor(
        @InjectRepository(MaterialColumn)
        private readonly columnRepository: Repository<MaterialColumn>,
    ) { }

    async create(jobId: string, createDto: CreateMaterialColumnDto): Promise<MaterialColumn> {
        const column = this.columnRepository.create({ ...createDto, jobId });
        return await this.columnRepository.save(column);
    }

    async findByJob(jobId: string): Promise<MaterialColumn[]> {
        return await this.columnRepository.find({ where: { jobId }, order: { order: 'ASC' } });
    }

    async findOne(id: string): Promise<MaterialColumn> {
        const column = await this.columnRepository.findOne({ where: { id } });
        if (!column) {
            throw new NotFoundException(`Material column with ID ${id} not found`);
        }
        return column;
    }

    async update(id: string, updateDto: UpdateMaterialColumnDto): Promise<MaterialColumn> {
        const column = await this.findOne(id);
        Object.assign(column, updateDto);
        return await this.columnRepository.save(column);
    }

    async remove(id: string): Promise<void> {
        const column = await this.findOne(id);
        await this.columnRepository.remove(column);
    }
}
