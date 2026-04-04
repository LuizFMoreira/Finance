import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty({ message: 'Título não pode ser vazio' })
  @MaxLength(100, { message: 'Título deve ter no máximo 100 caracteres' })
  title: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Valor inválido' })
  @Min(0.01, { message: 'Objetivo deve ser maior que zero' })
  target_amount: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Valor inválido' })
  @Min(0, { message: 'Valor guardado não pode ser negativo' })
  current_amount?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Data inválida' })
  deadline?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Valor inválido' })
  @Min(0, { message: 'Aporte mensal não pode ser negativo' })
  monthly_contribution?: number;
}
