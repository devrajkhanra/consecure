import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joint } from './entities/joint.entity';
import { Material } from '../material/entities/material.entity';
import { JointService } from './joint.service';
import { JointController } from './joint.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Joint, Material])],
    controllers: [JointController],
    providers: [JointService],
    exports: [JointService],
})
export class JointModule { }
