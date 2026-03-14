import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SpoolService } from './spool.service';
import { Spool } from './entities/spool.entity';
import { CreateSpoolDto } from './dto/create-spool.dto';
import { UpdateSpoolDto } from './dto/update-spool.dto';

@ApiTags('spools')
@ApiBearerAuth()
@Controller('drawings/:drawingId/spools')
export class SpoolController {
    constructor(private readonly spoolService: SpoolService) { }

    @Post()
    @ApiOperation({ summary: 'Create a spool for a drawing' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 201, description: 'The spool has been successfully created.', type: Spool })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
        @Body() createDto: CreateSpoolDto,
    ): Promise<Spool> {
        return await this.spoolService.create(drawingId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all spools for a drawing' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 200, description: 'Returns all spools for the drawing.', type: [Spool] })
    async findAll(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
    ): Promise<Spool[]> {
        return await this.spoolService.findByDrawing(drawingId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a spool by ID' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The spool ID' })
    @ApiResponse({ status: 200, description: 'Returns the spool.', type: Spool })
    @ApiResponse({ status: 404, description: 'Spool not found.' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Spool> {
        return await this.spoolService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a spool' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The spool ID' })
    @ApiResponse({ status: 200, description: 'The spool has been successfully updated.', type: Spool })
    @ApiResponse({ status: 404, description: 'Spool not found.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateSpoolDto,
    ): Promise<Spool> {
        return await this.spoolService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a spool' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The spool ID' })
    @ApiResponse({ status: 200, description: 'The spool has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Spool not found.' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        return await this.spoolService.remove(id);
    }
}
