import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  Min,
} from 'class-validator';

export enum TransactionNature {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição não pode ser vazia' })
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Valor inválido' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount: number;

  @IsEnum(TransactionNature, { message: 'Tipo deve ser "income" ou "expense"' })
  nature: TransactionNature;

  @IsDateString({}, { message: 'Data inválida' })
  date: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID de categoria inválido' })
  category_id?: string;
}
