import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export enum TransactionNature {
  INCOME = 'income',
  ESSENTIAL = 'essential',
  SUPERFLUOUS = 'superfluous',
}

export class CreateTransactionDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number; // positivo = receita, negativo = despesa

  @IsEnum(TransactionNature)
  nature: TransactionNature;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
