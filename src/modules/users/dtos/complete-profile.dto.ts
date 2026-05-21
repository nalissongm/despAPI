import { IsNotEmpty, IsString, IsOptional, IsDateString, Length, MinLength } from 'class-validator';

export class CompleteProfileDto {
  /**
   * CPF do usuário (exatamente 11 caracteres)
   */
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  cpf: string;

  /**
   * Data de nascimento em formato ISO
   */
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  /**
   * URL da imagem de perfil
   */
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  /**
   * Nova Senha
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  password: string;
}
