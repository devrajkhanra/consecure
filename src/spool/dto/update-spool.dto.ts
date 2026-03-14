import { PartialType } from '@nestjs/swagger';
import { CreateSpoolDto } from './create-spool.dto';

export class UpdateSpoolDto extends PartialType(CreateSpoolDto) { }
