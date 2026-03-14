import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrawingConnection } from './entities/drawing-connection.entity';
import { CreateDrawingConnectionDto } from './dto/create-drawing-connection.dto';
import { UpdateDrawingConnectionDto } from './dto/update-drawing-connection.dto';

@Injectable()
export class DrawingConnectionService {
    constructor(
        @InjectRepository(DrawingConnection)
        private readonly connectionRepository: Repository<DrawingConnection>,
    ) { }

    async create(createDto: CreateDrawingConnectionDto): Promise<DrawingConnection> {
        const connection = this.connectionRepository.create(createDto);
        return await this.connectionRepository.save(connection);
    }

    async findAll(): Promise<DrawingConnection[]> {
        return await this.connectionRepository.find();
    }

    async findByDrawing(drawingId: string): Promise<DrawingConnection[]> {
        return await this.connectionRepository.find({
            where: [
                { drawingOneId: drawingId },
                { drawingTwoId: drawingId },
            ],
            relations: ['material', 'spool', 'joint'],
        });
    }

    async findOne(id: string): Promise<DrawingConnection> {
        const connection = await this.connectionRepository.findOne({
            where: { id },
            relations: ['material', 'spool', 'joint'],
        });
        if (!connection) {
            throw new NotFoundException(`Drawing connection with ID ${id} not found`);
        }
        return connection;
    }

    async update(id: string, updateDto: UpdateDrawingConnectionDto): Promise<DrawingConnection> {
        const connection = await this.findOne(id);
        Object.assign(connection, updateDto);
        return await this.connectionRepository.save(connection);
    }

    async remove(id: string): Promise<void> {
        const connection = await this.findOne(id);
        await this.connectionRepository.remove(connection);
    }
}
