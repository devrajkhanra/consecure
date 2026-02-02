import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DrawingColumnService } from './drawing-column.service';
import { CreateDrawingColumnDto } from './dto/create-drawing-column.dto';
import { UpdateDrawingColumnDto } from './dto/update-drawing-column.dto';
import { DrawingColumn } from './entities/drawing-column.entity';

@ApiTags('drawing-columns')
@Controller('jobs/:jobId/columns')
export class DrawingColumnController {
    constructor(private readonly columnService: DrawingColumnService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new column for a job' })
    @ApiResponse({ status: 201, description: 'The column has been successfully created.', type: DrawingColumn })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Param('jobId', ParseUUIDPipe) jobId: string, @Body() createDto: CreateDrawingColumnDto) {
        return this.columnService.create(jobId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all columns for a job' })
    @ApiResponse({ status: 200, description: 'Return all columns for the job.', type: [DrawingColumn] })
    findByJob(@Param('jobId', ParseUUIDPipe) jobId: string) {
        return this.columnService.findByJob(jobId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a column by ID' })
    @ApiResponse({ status: 200, description: 'Return the column.', type: DrawingColumn })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.columnService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a column by ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully updated.', type: DrawingColumn })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateDrawingColumnDto) {
        return this.columnService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a column by ID' })
    @ApiResponse({ status: 200, description: 'The column has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Column not found.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.columnService.remove(id);
    }
}
