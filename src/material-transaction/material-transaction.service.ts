import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialTransaction } from './entities/material-transaction.entity';
import { MaterialTransactionType } from './entities/material-transaction-type.enum';
import { Material } from '../material/entities/material.entity';
import { MaterialStatus } from '../material/entities/material-status.enum';
import { CreateMaterialTransactionDto } from './dto/create-material-transaction.dto';
import { UpdateMaterialTransactionDto } from './dto/update-material-transaction.dto';

@Injectable()
export class MaterialTransactionService {
    constructor(
        @InjectRepository(MaterialTransaction)
        private readonly transactionRepository: Repository<MaterialTransaction>,
        @InjectRepository(Material)
        private readonly materialRepository: Repository<Material>,
    ) { }

    async create(materialId: string, createDto: CreateMaterialTransactionDto): Promise<MaterialTransaction> {
        // Verify material exists
        const material = await this.materialRepository.findOne({ where: { id: materialId } });
        if (!material) {
            throw new NotFoundException(`Material with ID ${materialId} not found`);
        }

        const transaction = this.transactionRepository.create({ ...createDto, materialId });
        const saved = await this.transactionRepository.save(transaction);
        await this.recalculateMaterial(materialId);
        return saved;
    }

    async findByMaterial(materialId: string): Promise<MaterialTransaction[]> {
        return await this.transactionRepository.find({
            where: { materialId },
            order: { transactionDate: 'ASC', createdAt: 'ASC' },
        });
    }

    async findOne(id: string): Promise<MaterialTransaction> {
        const transaction = await this.transactionRepository.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException(`Material transaction with ID ${id} not found`);
        }
        return transaction;
    }

    async update(id: string, updateDto: UpdateMaterialTransactionDto): Promise<MaterialTransaction> {
        const transaction = await this.findOne(id);
        Object.assign(transaction, updateDto);
        const saved = await this.transactionRepository.save(transaction);
        await this.recalculateMaterial(transaction.materialId);
        return saved;
    }

    async remove(id: string): Promise<void> {
        const transaction = await this.findOne(id);
        const materialId = transaction.materialId;
        await this.transactionRepository.remove(transaction);
        await this.recalculateMaterial(materialId);
    }

    /**
     * Recalculate a material's quantityIssued, quantityUsed, and status
     * based on the sum of all its transactions.
     */
    private async recalculateMaterial(materialId: string): Promise<void> {
        const material = await this.materialRepository.findOne({ where: { id: materialId } });
        if (!material) return;

        // Sum quantities by transaction type
        const aggregates = await this.transactionRepository
            .createQueryBuilder('txn')
            .select('txn.transaction_type', 'transactionType')
            .addSelect('COALESCE(SUM(txn.quantity), 0)', 'total')
            .where('txn.material_id = :materialId', { materialId })
            .groupBy('txn.transaction_type')
            .getRawMany();

        let totalIssued = 0;
        let totalUsed = 0;
        let totalReturned = 0;

        for (const row of aggregates) {
            const total = parseFloat(row.total);
            switch (row.transactionType) {
                case MaterialTransactionType.ISSUED:
                    totalIssued = total;
                    break;
                case MaterialTransactionType.USED:
                    totalUsed = total;
                    break;
                case MaterialTransactionType.RETURNED:
                    totalReturned = total;
                    break;
            }
        }

        // Net issued = issued - returned
        const netIssued = totalIssued - totalReturned;

        material.quantityIssued = netIssued;
        material.quantityUsed = totalUsed;

        // Auto-derive status
        const required = parseFloat(material.quantityRequired as any) || 0;
        if (totalUsed >= required && required > 0) {
            material.status = MaterialStatus.USED;
        } else if (netIssued >= required && required > 0) {
            material.status = MaterialStatus.ISSUED;
        } else if (netIssued > 0) {
            material.status = MaterialStatus.PENDING;
        } else {
            material.status = MaterialStatus.REQUIRED;
        }

        await this.materialRepository.save(material);
    }
}
