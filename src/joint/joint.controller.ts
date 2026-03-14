import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JointService } from './joint.service';
import { Joint } from './entities/joint.entity';
import { CreateJointDto } from './dto/create-joint.dto';
import { UpdateJointDto } from './dto/update-joint.dto';
import { UpdateJointStageDto } from './dto/update-joint-stage.dto';

@ApiTags('joints')
@Controller('drawings/:drawingId/joints')
export class JointController {
    constructor(private readonly jointService: JointService) { }

    @Post()
    @ApiOperation({ summary: 'Create a joint for a drawing' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 201, description: 'The joint has been successfully created.', type: Joint })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
        @Body() createDto: CreateJointDto,
    ): Promise<Joint> {
        return await this.jointService.create(drawingId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all joints for a drawing' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 200, description: 'Returns all joints for the drawing.', type: [Joint] })
    async findAll(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
    ): Promise<Joint[]> {
        return await this.jointService.findByDrawing(drawingId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a joint by ID' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The joint ID' })
    @ApiResponse({ status: 200, description: 'Returns the joint.', type: Joint })
    @ApiResponse({ status: 404, description: 'Joint not found.' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Joint> {
        return await this.jointService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a joint' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The joint ID' })
    @ApiResponse({ status: 200, description: 'The joint has been successfully updated.', type: Joint })
    @ApiResponse({ status: 404, description: 'Joint not found.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateJointDto,
    ): Promise<Joint> {
        return await this.jointService.update(id, updateDto);
    }

    @Patch(':id/stage')
    @ApiOperation({ summary: 'Update a joint stage (auto-marks materials as used)' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The joint ID' })
    @ApiResponse({ status: 200, description: 'The joint stage has been updated.', type: Joint })
    @ApiResponse({ status: 404, description: 'Joint not found.' })
    async updateStage(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() stageDto: UpdateJointStageDto,
    ): Promise<Joint> {
        return await this.jointService.updateStage(id, stageDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a joint' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiParam({ name: 'id', description: 'The joint ID' })
    @ApiResponse({ status: 200, description: 'The joint has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Joint not found.' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        return await this.jointService.remove(id);
    }
}
