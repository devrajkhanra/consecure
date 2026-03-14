import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spool } from './entities/spool.entity';
import { SpoolService } from './spool.service';
import { SpoolController } from './spool.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Spool])],
    controllers: [SpoolController],
    providers: [SpoolService],
    exports: [SpoolService],
})
export class SpoolModule { }
