import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MaterialColumnService } from './material-column.service';
import { MaterialColumn } from './entities/material-column.entity';
import { CreateMaterialColumnDto } from './dto/create-material-column.dto';
import { UpdateMaterialColumnDto } from './dto/update-material-column.dto';

@ApiTags('material-columns')
@Controller('jobs/:jobId/material-columns')
export class MaterialColumnController {
    constructor(private readonly columnService: MaterialColumnService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new material column for a job' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiResponse({ status: 201, description: 'The column has been successfully created.', type: MaterialColumn })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(
        @Param('jobId', ParseUUIDPipe) jobId: string,
        @Body() createDto: CreateMaterialColumnDto,
    ): Promise<MaterialColumn> {
        return await this.columnService.create(jobId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all material columns for a job' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiResponse({ status: 200, description: 'Returns all material columns for the job.', type: [MaterialColumn] })
    async findAll(
        @Param('jobId', ParseUUIDPipe) jobId: string,
    ): Promise<MaterialColumn[]> {
        return await this.columnService.findByJob(jobId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a material column' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiParam({ name: 'id', description: 'The column ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully updated.', type: MaterialColumn })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateMaterialColumnDto,
    ): Promise<MaterialColumn> {
        return await this.columnService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a material column' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiParam({ name: 'id', description: 'The column ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        return await this.columnService.remove(id);
    }
}
