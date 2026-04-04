import { IsEmail, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @MaxLength(72)
  password: string;
}
