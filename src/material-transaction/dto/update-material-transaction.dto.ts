import { PartialType } from '@nestjs/swagger';
import { CreateMaterialTransactionDto } from './create-material-transaction.dto';

export class UpdateMaterialTransactionDto extends PartialType(CreateMaterialTransactionDto) { }
