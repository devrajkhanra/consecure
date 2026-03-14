import { PartialType } from '@nestjs/swagger';
import { CreateDrawingConnectionDto } from './create-drawing-connection.dto';

export class UpdateDrawingConnectionDto extends PartialType(CreateDrawingConnectionDto) { }
