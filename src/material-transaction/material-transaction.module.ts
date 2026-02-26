import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialTransaction } from './entities/material-transaction.entity';
import { Material } from '../material/entities/material.entity';
import { MaterialTransactionService } from './material-transaction.service';
import { MaterialTransactionController } from './material-transaction.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MaterialTransaction, Material])],
    controllers: [MaterialTransactionController],
    providers: [MaterialTransactionService],
    exports: [MaterialTransactionService],
})
export class MaterialTransactionModule { }
