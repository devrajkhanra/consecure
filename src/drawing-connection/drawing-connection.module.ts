import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawingConnection } from './entities/drawing-connection.entity';
import { DrawingConnectionService } from './drawing-connection.service';
import { DrawingConnectionController } from './drawing-connection.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DrawingConnection])],
    controllers: [DrawingConnectionController],
    providers: [DrawingConnectionService],
    exports: [DrawingConnectionService],
})
export class DrawingConnectionModule { }
