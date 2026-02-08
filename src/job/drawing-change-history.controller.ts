import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DrawingChangeHistoryService } from './drawing-change-history.service';
import { DrawingChangeHistory } from './entities/drawing-change-history.entity';
import { ChangeType } from './entities/change-type.enum';

@ApiTags('Drawing Change History')
@Controller('jobs/:jobId')
export class DrawingChangeHistoryController {
    constructor(private readonly changeHistoryService: DrawingChangeHistoryService) { }

    @Get('drawings/:drawingId/history')
    @ApiOperation({ summary: 'Get change history for a specific drawing' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 200, description: 'Returns the change history for the drawing', type: [DrawingChangeHistory] })
    async getDrawingHistory(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
    ): Promise<DrawingChangeHistory[]> {
        return await this.changeHistoryService.findByDrawing(drawingId);
    }

    @Get('change-history')
    @ApiOperation({ summary: 'Get all change history for a job' })
    @ApiParam({ name: 'jobId', description: 'The job ID' })
    @ApiQuery({ name: 'type', enum: ChangeType, required: false, description: 'Filter by change type' })
    @ApiResponse({ status: 200, description: 'Returns the change history for the job', type: [DrawingChangeHistory] })
    async getJobChangeHistory(
        @Param('jobId', ParseUUIDPipe) jobId: string,
        @Query('type') changeType?: ChangeType,
    ): Promise<DrawingChangeHistory[]> {
        return await this.changeHistoryService.findByJob(jobId, changeType);
    }
}

// Alternative controller for simpler route without jobId
@ApiTags('Drawing Change History')
@Controller('drawings')
export class DrawingChangeHistoryAltController {
    constructor(private readonly changeHistoryService: DrawingChangeHistoryService) { }

    @Get(':drawingId/history')
    @ApiOperation({ summary: 'Get change history for a specific drawing (without jobId)' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 200, description: 'Returns the change history for the drawing', type: [DrawingChangeHistory] })
    async getDrawingHistory(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
    ): Promise<DrawingChangeHistory[]> {
        return await this.changeHistoryService.findByDrawing(drawingId);
    }
}

