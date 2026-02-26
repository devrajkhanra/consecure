import { PartialType } from '@nestjs/swagger';
import { CreateMaterialColumnDto } from './create-material-column.dto';

export class UpdateMaterialColumnDto extends PartialType(CreateMaterialColumnDto) { }
