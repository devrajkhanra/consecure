import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DrawingConnectionService } from './drawing-connection.service';
import { DrawingConnection } from './entities/drawing-connection.entity';
import { CreateDrawingConnectionDto } from './dto/create-drawing-connection.dto';
import { UpdateDrawingConnectionDto } from './dto/update-drawing-connection.dto';

@ApiTags('drawing-connections')
@Controller('drawing-connections')
export class DrawingConnectionController {
    constructor(private readonly connectionService: DrawingConnectionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a connection between two drawings' })
    @ApiResponse({ status: 201, description: 'The connection has been successfully created.', type: DrawingConnection })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createDto: CreateDrawingConnectionDto): Promise<DrawingConnection> {
        return await this.connectionService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all drawing connections' })
    @ApiResponse({ status: 200, description: 'Returns all drawing connections.', type: [DrawingConnection] })
    async findAll(): Promise<DrawingConnection[]> {
        return await this.connectionService.findAll();
    }

    @Get('drawing/:drawingId')
    @ApiOperation({ summary: 'Get all connections for a specific drawing' })
    @ApiParam({ name: 'drawingId', description: 'The drawing ID' })
    @ApiResponse({ status: 200, description: 'Returns all connections involving this drawing.', type: [DrawingConnection] })
    async findByDrawing(
        @Param('drawingId', ParseUUIDPipe) drawingId: string,
    ): Promise<DrawingConnection[]> {
        return await this.connectionService.findByDrawing(drawingId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a drawing connection by ID' })
    @ApiParam({ name: 'id', description: 'The connection ID' })
    @ApiResponse({ status: 200, description: 'Returns the connection.', type: DrawingConnection })
    @ApiResponse({ status: 404, description: 'Connection not found.' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DrawingConnection> {
        return await this.connectionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a drawing connection' })
    @ApiParam({ name: 'id', description: 'The connection ID' })
    @ApiResponse({ status: 200, description: 'The connection has been successfully updated.', type: DrawingConnection })
    @ApiResponse({ status: 404, description: 'Connection not found.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateDrawingConnectionDto,
    ): Promise<DrawingConnection> {
        return await this.connectionService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a drawing connection' })
    @ApiParam({ name: 'id', description: 'The connection ID' })
    @ApiResponse({ status: 200, description: 'The connection has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Connection not found.' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        return await this.connectionService.remove(id);
    }
}
