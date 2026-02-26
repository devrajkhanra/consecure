import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialColumn } from './entities/material-column.entity';
import { MaterialService } from './material.service';
import { MaterialColumnService } from './material-column.service';
import { MaterialController, JobMaterialController } from './material.controller';
import { MaterialColumnController } from './material-column.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Material, MaterialColumn])],
    controllers: [MaterialController, JobMaterialController, MaterialColumnController],
    providers: [MaterialService, MaterialColumnService],
    exports: [MaterialService, MaterialColumnService],
})
export class MaterialModule { }
