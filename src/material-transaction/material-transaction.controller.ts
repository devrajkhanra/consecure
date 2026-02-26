import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MaterialTransactionService } from './material-transaction.service';
import { MaterialTransaction } from './entities/material-transaction.entity';
import { CreateMaterialTransactionDto } from './dto/create-material-transaction.dto';
import { UpdateMaterialTransactionDto } from './dto/update-material-transaction.dto';

@ApiTags('material-transactions')
@Controller('materials/:materialId/transactions')
export class MaterialTransactionController {
    constructor(private readonly transactionService: MaterialTransactionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a material transaction (auto-updates material lifecycle)' })
    @ApiParam({ name: 'materialId', description: 'The material ID' })
    @ApiResponse({ status: 201, description: 'The transaction has been successfully created.', type: MaterialTransaction })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 404, description: 'Material not found.' })
    async create(
        @Param('materialId', ParseUUIDPipe) materialId: string,
        @Body() createDto: CreateMaterialTransactionDto,
    ): Promise<MaterialTransaction> {
        return await this.transactionService.create(materialId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions for a material' })
    @ApiParam({ name: 'materialId', description: 'The material ID' })
    @ApiResponse({ status: 200, description: 'Returns all transactions for the material.', type: [MaterialTransaction] })
    async findAll(
        @Param('materialId', ParseUUIDPipe) materialId: string,
    ): Promise<MaterialTransaction[]> {
        return await this.transactionService.findByMaterial(materialId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a transaction by ID' })
    @ApiParam({ name: 'materialId', description: 'The material ID' })
    @ApiParam({ name: 'id', description: 'The transaction ID' })
    @ApiResponse({ status: 200, description: 'Returns the transaction.', type: MaterialTransaction })
    @ApiResponse({ status: 404, description: 'Transaction not found.' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<MaterialTransaction> {
        return await this.transactionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a transaction (auto-updates material lifecycle)' })
    @ApiParam({ name: 'materialId', description: 'The material ID' })
    @ApiParam({ name: 'id', description: 'The transaction ID' })
    @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.', type: MaterialTransaction })
    @ApiResponse({ status: 404, description: 'Transaction not found.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateMaterialTransactionDto,
    ): Promise<MaterialTransaction> {
        return await this.transactionService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a transaction (auto-updates material lifecycle)' })
    @ApiParam({ name: 'materialId', description: 'The material ID' })
    @ApiParam({ name: 'id', description: 'The transaction ID' })
    @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Transaction not found.' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        return await this.transactionService.remove(id);
    }
}
