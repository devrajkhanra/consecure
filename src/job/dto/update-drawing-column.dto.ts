import { PartialType } from '@nestjs/swagger';
import { CreateDrawingColumnDto } from './create-drawing-column.dto';

export class UpdateDrawingColumnDto extends PartialType(CreateDrawingColumnDto) { }
