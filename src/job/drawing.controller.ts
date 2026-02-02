import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DrawingService } from './drawing.service';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { Drawing } from './entities/drawing.entity';

@ApiTags('drawings')
@Controller('jobs/:jobId/drawings')
export class DrawingController {
    constructor(private readonly drawingService: DrawingService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new drawing for a job' })
    @ApiResponse({ status: 201, description: 'The drawing has been successfully created.', type: Drawing })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Param('jobId', ParseUUIDPipe) jobId: string, @Body() createDto: CreateDrawingDto) {
        return this.drawingService.create(jobId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all drawings for a job' })
    @ApiResponse({ status: 200, description: 'Return all drawings for the job.', type: [Drawing] })
    findByJob(@Param('jobId', ParseUUIDPipe) jobId: string) {
        return this.drawingService.findByJob(jobId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a drawing by ID' })
    @ApiResponse({ status: 200, description: 'Return the drawing.', type: Drawing })
    @ApiResponse({ status: 404, description: 'Drawing not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.drawingService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a drawing by ID' })
    @ApiResponse({ status: 200, description: 'The drawing has been successfully updated.', type: Drawing })
    @ApiResponse({ status: 404, description: 'Drawing not found.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateDrawingDto) {
        return this.drawingService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a drawing by ID' })
    @ApiResponse({ status: 200, description: 'The drawing has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Drawing not found.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.drawingService.remove(id);
    }
}
