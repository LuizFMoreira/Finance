import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0.01)
  target_amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  current_amount?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_contribution?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
