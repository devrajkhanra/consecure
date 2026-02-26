import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { Material } from './entities/material.entity';
import { MaterialStatus } from './entities/material-status.enum';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';

@ApiTags('materials')
@Controller('drawings/:drawingId/materials')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Post()
    @ApiOperation({ summary: 'Add a material to a drawing' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 201, description: 'The material has been successfully created.', type: Material })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
        @Body() createDto: CreateMaterialDto,
    ): Promise<Material> {
        return await this.materialService.create(drawingId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all materials for a drawing (optionally filter by status)' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiQuery({ name: 'status', enum: MaterialStatus, required: false, description: 'Filter by material status' })
    @ApiResponse({ status: 200, description: 'Returns all materials for the drawing.', type: [Material] })
    async findAll(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
        @Query('status') status?: MaterialStatus,
    ): Promise<Material[]> {
        return await this.materialService.findByDrawing(drawingId, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a material by ID' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The material ID' })
    @ApiResponse({ status: 200, description: 'Returns the material.', type: Material })
    @ApiResponse({ status: 404, description: 'Material not found.' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Material> {
        return await this.materialService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a material' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The material ID' })
    @ApiResponse({ status: 200, description: 'The material has been successfully updated.', type: Material })
    @ApiResponse({ status: 404, description: 'Material not found.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateMaterialDto,
    ): Promise<Material> {
        return await this.materialService.update(id, updateDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update the status of a material' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The material ID' })
    @ApiResponse({ status: 200, description: 'The material status has been successfully updated.', type: Material })
    @ApiResponse({ status: 404, description: 'Material not found.' })
    async updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateMaterialStatusDto,
    ): Promise<Material> {
        return await this.materialService.updateStatus(id, dto.status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a material' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The material ID' })
    @ApiResponse({ status: 200, description: 'The material has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Material not found.' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        return await this.materialService.remove(id);
    }
}

// Job-level material access
@ApiTags('materials')
@Controller('jobs/:jobId/materials')
export class JobMaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Get()
    @ApiOperation({ summary: 'Get all materials for a job (across all latest drawings)' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiResponse({ status: 200, description: 'Returns all materials for the job.', type: [Material] })
    async findAllByJob(
        @Param('jobId', ParseUUIDPipe) jobId: string,
    ): Promise<Material[]> {
        return await this.materialService.findByJob(jobId);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get material summary for a job grouped by status' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiResponse({ status: 200, description: 'Returns aggregated material data grouped by status.' })
    async getSummary(
        @Param('jobId', ParseUUIDPipe) jobId: string,
    ) {
        return await this.materialService.getJobMaterialSummary(jobId);
    }
}
