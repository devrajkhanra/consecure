import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DrawingColumn } from './entities/drawing-column.entity';
import { Drawing } from './entities/drawing.entity';
import { DrawingChangeHistory } from './entities/drawing-change-history.entity';
import { JobService } from './job.service';
import { DrawingColumnService } from './drawing-column.service';
import { DrawingService } from './drawing.service';
import { DrawingChangeHistoryService } from './drawing-change-history.service';
import { JobController } from './job.controller';
import { DrawingColumnController } from './drawing-column.controller';
import { DrawingController } from './drawing.controller';
import { DrawingChangeHistoryController, DrawingChangeHistoryAltController } from './drawing-change-history.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Job, DrawingColumn, Drawing, DrawingChangeHistory])],
    controllers: [JobController, DrawingColumnController, DrawingController, DrawingChangeHistoryController, DrawingChangeHistoryAltController],
    providers: [JobService, DrawingColumnService, DrawingService, DrawingChangeHistoryService],
    exports: [JobService, DrawingColumnService, DrawingService, DrawingChangeHistoryService],
})
export class JobModule { }

