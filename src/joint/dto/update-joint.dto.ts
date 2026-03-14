import { PartialType } from '@nestjs/swagger';
import { CreateJointDto } from './create-joint.dto';

export class UpdateJointDto extends PartialType(CreateJointDto) { }
