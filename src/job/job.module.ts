import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DrawingColumn } from './entities/drawing-column.entity';
import { Drawing } from './entities/drawing.entity';
import { JobService } from './job.service';
import { DrawingColumnService } from './drawing-column.service';
import { DrawingService } from './drawing.service';
import { JobController } from './job.controller';
import { DrawingColumnController } from './drawing-column.controller';
import { DrawingController } from './drawing.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Job, DrawingColumn, Drawing])],
    controllers: [JobController, DrawingColumnController, DrawingController],
    providers: [JobService, DrawingColumnService, DrawingService],
    exports: [JobService, DrawingColumnService, DrawingService],
})
export class JobModule { }
