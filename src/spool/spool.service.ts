import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spool } from './entities/spool.entity';
import { CreateSpoolDto } from './dto/create-spool.dto';
import { UpdateSpoolDto } from './dto/update-spool.dto';

@Injectable()
export class SpoolService {
    constructor(
        @InjectRepository(Spool)
        private readonly spoolRepository: Repository<Spool>,
    ) { }

    async create(drawingId: string, createDto: CreateSpoolDto): Promise<Spool> {
        const spool = this.spoolRepository.create({ ...createDto, drawingId });
        return await this.spoolRepository.save(spool);
    }

    async findByDrawing(drawingId: string): Promise<Spool[]> {
        return await this.spoolRepository.find({
            where: { drawingId },
            order: { spoolNumber: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Spool> {
        const spool = await this.spoolRepository.findOne({ where: { id } });
        if (!spool) {
            throw new NotFoundException(`Spool with ID ${id} not found`);
        }
        return spool;
    }

    async update(id: string, updateDto: UpdateSpoolDto): Promise<Spool> {
        const spool = await this.findOne(id);
        Object.assign(spool, updateDto);
        return await this.spoolRepository.save(spool);
    }

    async remove(id: string): Promise<void> {
        const spool = await this.findOne(id);
        await this.spoolRepository.remove(spool);
    }
}
