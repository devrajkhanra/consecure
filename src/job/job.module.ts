import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DrawingColumn } from './entities/drawing-column.entity';
import { Drawing } from './entities/drawing.entity';
import { DrawingChangeHistory } from './entities/drawing-change-history.entity';
import { Material } from './entities/material.entity';
import { MaterialColumn } from './entities/material-column.entity';
import { JobService } from './job.service';
import { DrawingColumnService } from './drawing-column.service';
import { DrawingService } from './drawing.service';
import { DrawingChangeHistoryService } from './drawing-change-history.service';
import { MaterialService } from './material.service';
import { MaterialColumnService } from './material-column.service';
import { JobController } from './job.controller';
import { DrawingColumnController } from './drawing-column.controller';
import { DrawingController } from './drawing.controller';
import { DrawingChangeHistoryController, DrawingChangeHistoryAltController } from './drawing-change-history.controller';
import { MaterialController, JobMaterialController } from './material.controller';
import { MaterialColumnController } from './material-column.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Job, DrawingColumn, Drawing, DrawingChangeHistory, Material, MaterialColumn])],
    controllers: [JobController, DrawingColumnController, DrawingController, DrawingChangeHistoryController, DrawingChangeHistoryAltController, MaterialController, JobMaterialController, MaterialColumnController],
    providers: [JobService, DrawingColumnService, DrawingService, DrawingChangeHistoryService, MaterialService, MaterialColumnService],
    exports: [JobService, DrawingColumnService, DrawingService, DrawingChangeHistoryService, MaterialService, MaterialColumnService],
})
export class JobModule { }



